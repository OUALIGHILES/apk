import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '@/config';

// Use proxy in development to avoid CORS issues
const USE_PROXY = process.env.NODE_ENV === 'development';
// Use mock API when backend is down (set NEXT_PUBLIC_USE_MOCK_API=true in .env.local)
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: USE_MOCK_API ? '/api/mock' : (USE_PROXY ? '/api/proxy' : API_CONFIG.BASE_URL),
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available (not for mock API)
    if (typeof window !== 'undefined' && !USE_MOCK_API) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      const userId = localStorage.getItem('user_id');
      if (userId && !USE_PROXY) {
        config.params = { ...config.params, user_id: userId };
      }
    }

    // If using mock API, pass endpoint as parameter (URL is already set by baseURL)
    if (USE_MOCK_API && config.url) {
      const originalUrl = config.url.replace(/^\/+/, ''); // Remove leading slashes
      config.url = ''; // Clear URL since baseURL points to /api/mock
      config.params = {
        ...config.params,
        endpoint: originalUrl,
      };
    }
    // If using proxy, add endpoint as param (not for mock API)
    else if (USE_PROXY && !USE_MOCK_API && config.url) {
      const originalUrl = config.url.replace(/^\/+/, ''); // Remove leading slashes
      config.url = '';
      config.params = {
        ...config.params,
        endpoint: originalUrl,
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// API service methods
export const apiService = {
  // GET request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.get(endpoint, { params });
    return response.data;
  },

  // POST request
  async post<T>(endpoint: string, data?: Record<string, any>): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.post(endpoint, data);
    return response.data;
  },

  // GET with auth
  async getAuth<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.get(endpoint, { params });
    return response.data;
  },

  // POST with auth
  async postAuth<T>(endpoint: string, data?: Record<string, any>): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.post(endpoint, data);
    return response.data;
  },
};

export default apiClient;
