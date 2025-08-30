import { request } from './client';
import type { Category, CategoryInput, CategoryUpdate } from '@shared/types';

export const categoriesApi = {
  getAll(isActive?: boolean) {
    return request<{ data: Category[] }>('GET', '/categories', null, { is_active: isActive });
  },

  getById(id: string) {
    return request<{ data: Category }>('GET', `/categories/${id}`);
  },

  create(data: CategoryInput) {
    return request<{ data: Category }>('POST', '/categories', data);
  },

  update(id: string, data: CategoryUpdate) {
    return request<{ data: Category }>('PATCH', `/categories/${id}`, data);
  },

  delete(id: string) {
    return request<{ message: string }>('DELETE', `/categories/${id}`);
  },

  updateOrder(categories: Array<{ id: string; display_order: number }>) {
    return request<{ message: string }>('POST', '/categories/reorder', { categories });
  },
};