import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api`
    : '/api',
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('sm_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem('sm_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export const getErrorMessage = (e: any): string => {
  if (e?.response?.data?.error) return e.response.data.error;
  if (e?.response?.data?.errors) return e.response.data.errors.map((x: any) => x.msg).join(', ');
  if (e?.message) return e.message;
  return 'Error desconocido';
};