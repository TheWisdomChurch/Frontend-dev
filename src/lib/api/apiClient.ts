/**
 * API Client Service
 * Centralized HTTP client for all backend communication
 * Provides consistent error handling, request/response interceptors, and type safety
 */

import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

class APIClient {
  private instance: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add request ID for debugging
        config.headers['X-Request-ID'] = this.generateRequestId();

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        // Handle common error scenarios
        if (error.response?.status === 401) {
          this.handleUnauthorized();
        }
        if (error.response?.status === 403) {
          console.error('Forbidden: Access denied');
        }
        if (error.response?.status === 404) {
          console.error('Not found: Resource does not exist');
        }
        if (error.response?.status === 500) {
          console.error('Server error: Internal server error');
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Handle unauthorized response
   */
  private handleUnauthorized(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
  }

  /**
   * Generate unique request ID for tracking
   */
  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * GET request
   */
  async get<T = any>(
    url: string,
    config?: any
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.get<ApiResponse<T>>(url, config);
  }

  /**
   * POST request
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: any
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.post<ApiResponse<T>>(url, data, config);
  }

  /**
   * PUT request
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: any
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.put<ApiResponse<T>>(url, data, config);
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: any
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.patch<ApiResponse<T>>(url, data, config);
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    url: string,
    config?: any
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.delete<ApiResponse<T>>(url, config);
  }

  /**
   * Get raw axios instance for custom configurations
   */
  getInstance(): AxiosInstance {
    return this.instance;
  }

  /**
   * Set base URL (useful for switching environments)
   */
  setBaseURL(url: string): void {
    this.baseURL = url;
    this.instance.defaults.baseURL = url;
  }

}

// Export singleton instance
export const apiClient = new APIClient();
