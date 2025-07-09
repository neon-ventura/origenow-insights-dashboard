
import { getActiveToken } from '@/utils/auth';

export interface SSEOptions {
  onMessage: (event: MessageEvent) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
}

export class SSEClient {
  private eventSource: EventSource | null = null;

  constructor(private url: string, private options: SSEOptions) {}

  connect(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }

    const token = getActiveToken();
    
    // Para SSE, tentamos usar headers primeiro
    // Se não funcionar, o servidor deve implementar autenticação via URL como fallback
    try {
      this.eventSource = new EventSource(this.url);
      
      // Infelizmente, EventSource não suporta headers customizados nativamente
      // Vamos usar fetch para fazer uma requisição inicial com headers
      if (token) {
        fetch(this.url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'text/event-stream',
            'Cache-Control': 'no-cache',
          },
        }).then(response => {
          if (!response.ok) {
            console.warn('Failed to authenticate with headers, falling back to URL token');
            // Se falhar, reconecta com token na URL como fallback
            this.connectWithUrlToken();
            return;
          }
          // Se a autenticação por header funcionar, mantém a conexão SSE normal
        }).catch(error => {
          console.warn('Error with header authentication, falling back to URL token:', error);
          this.connectWithUrlToken();
        });
      }
      
    } catch (error) {
      console.error('Error creating EventSource:', error);
      this.connectWithUrlToken();
    }
    
    this.eventSource.onmessage = this.options.onMessage;
    
    this.eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      this.options.onError?.(error);
    };
    
    this.eventSource.onopen = () => {
      console.log('SSE connection opened');
      this.options.onOpen?.();
    };
  }

  private connectWithUrlToken(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }

    const token = getActiveToken();
    const urlWithToken = `${this.url}${token ? `?token=${encodeURIComponent(token)}` : ''}`;
    
    this.eventSource = new EventSource(urlWithToken);
    
    this.eventSource.onmessage = this.options.onMessage;
    
    this.eventSource.onerror = (error) => {
      console.error('SSE error with URL token:', error);
      this.options.onError?.(error);
    };
    
    this.eventSource.onopen = () => {
      console.log('SSE connection opened with URL token');
      this.options.onOpen?.();
    };
  }

  close(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  getReadyState(): number {
    return this.eventSource?.readyState ?? EventSource.CLOSED;
  }
}
