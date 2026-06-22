/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

// ── Create instance ───────────────────────────────────────────────────────────
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FORUM_API,
  withCredentials: true, // sends JWT cookie automatically
});

// ── Request interceptor — attach JWT from localStorage if using Bearer ────────
api.interceptors.request.use((config:any) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('forum_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['Content-Type'] = config.headers['Content-Type'] ?? 'application/json';
  config.headers['accept'] = 'application/json';
  return config;
});

// ── Response interceptor ──────────────────────────────────────────────────────
api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (!error.response) {
      // Network error / no connection
      return Promise.reject('Network error. Check your connection.');
    }

    const { status } = error.response;
    const message: string = error.response.data?.message ?? error.message;

    switch (status) {
      case 401:
        // Token expired — clear and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('forum_token');
          window.location.href = '/auth/login';
        }
        return Promise.reject('Session expired. Please log in again.');

      case 403:
        return Promise.reject('You do not have permission to do that.');

      case 404:
        return Promise.reject('Not found.');

      case 422:
        // Validation errors — return field errors for forms
        return Promise.reject(error.response.data);

      case 429:
        return Promise.reject('Too many requests. Slow down.');

      case 500:
        return Promise.reject('Server error. Try again later.');

      default:
        return Promise.reject(message);
    }
  }
);

// ── Types ─────────────────────────────────────────────────────────────────────
interface RequestOptions extends AxiosRequestConfig {
  params?: Record<string, unknown>;
}

// ── API core class ────────────────────────────────────────────────────────────
export default class ForumApi {

  // GET /endpoint?params
  async get<T>(endpoint: string, params: Record<string, unknown> = {}): Promise<T> {
    const response = await api.get<T>(endpoint, { params });
    return response.data;
  }

  // POST /endpoint — create
  async post<T>(endpoint: string, body: unknown = {}, options?: RequestOptions): Promise<T> {
    const response = await api.post<T>(endpoint, body, options);
    return response.data;
  }

  // PUT /endpoint — full replace
  async put<T>(endpoint: string, body: unknown = {}): Promise<T> {
    const response = await api.put<T>(endpoint, body);
    return response.data;
  }

  // PATCH /endpoint — partial update
  async patch<T>(endpoint: string, body: unknown = {}): Promise<T> {
    const response = await api.patch<T>(endpoint, body);
    return response.data;
  }

  // DELETE /endpoint
  async delete<T>(endpoint: string): Promise<T> {
    const response = await api.delete<T>(endpoint);
    return response.data;
  }

  // POST with FormData — for avatar/banner uploads
  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const response = await api.post<T>(endpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
}