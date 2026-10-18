import axios, { AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  clearSession,
} from '../auth/sessionStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh'];

function isAuthEndpoint(url?: string): boolean {
  if (!url) return false;
  return AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

function toTranslatedError(error: AxiosError): Error {
  const data = error.response?.data;
  if (
    data &&
    typeof data === 'object' &&
    'error' in data &&
    typeof (data as { error?: unknown }).error === 'string'
  ) {
    return new Error((data as { error: string }).error);
  }
  return error;
}

// Create axios instance
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(toTranslatedError(error));
  }
);

// Response interceptor for token refresh and error translation
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // Handle 401 errors on protected routes (skip login/register/refresh endpoints)
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest.url)
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          clearSession();
          window.location.href = '/login';
          return Promise.reject(toTranslatedError(error));
        }

        // Attempt to refresh token
        const response = await axios.post<{ accessToken: string }>(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        saveAccessToken(accessToken);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return axiosClient(originalRequest);
      } catch (refreshError) {
        clearSession();
        window.location.href = '/login';
        return Promise.reject(
          refreshError instanceof AxiosError ? toTranslatedError(refreshError) : refreshError
        );
      }
    }

    return Promise.reject(toTranslatedError(error));
  }
);

export default axiosClient;
