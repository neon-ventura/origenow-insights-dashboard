
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

    // Para SSE, o token deve ser passado como parâmetro da URL pois headers não são suportados
    const token = getActiveToken();
    const urlWithToken = `${this.url}${token ? `?token=${encodeURIComponent(token)}` : ''}`;
    
    this.eventSource = new EventSource(urlWithToken);
    
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
