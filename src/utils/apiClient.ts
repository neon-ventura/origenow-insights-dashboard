
import { API_BASE_URL } from '@/config/endpoints';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { skipAuth = false, ...requestOptions } = options;
    
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...requestOptions,
      headers: {
        ...(skipAuth ? {} : this.getAuthHeaders()),
        ...requestOptions.headers,
      },
    };

    console.log(`API Request: ${requestOptions.method || 'GET'} ${url}`);
    
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const isFormData = data instanceof FormData;
    const config: RequestOptions = {
      ...options,
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
    };

    // Remove Content-Type header for FormData to let the browser set it with boundary
    if (isFormData && config.headers) {
      const headers = { ...config.headers };
      delete (headers as any)['Content-Type'];
      config.headers = headers;
    }

    return this.request<T>(endpoint, config);
  }

  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // Método especial para downloads
  async download(endpoint: string, filename: string): Promise<void> {
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

// Instância singleton do cliente da API
export const apiClient = new ApiClient(API_BASE_URL);
