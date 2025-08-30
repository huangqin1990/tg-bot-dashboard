import axios from 'axios';
import type { ApiResponse } from '@shared/types';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
);

export async function request<T>(
  method: string,
  url: string,
  data?: any,
  params?: any
): Promise<T> {
  const response = await apiClient.request<ApiResponse<T>>({
    method,
    url,
    data,
    params,
  });

  if (response.data.error) {
    throw new Error(response.data.error);
  }

  return response.data as T;
}

export default apiClient;