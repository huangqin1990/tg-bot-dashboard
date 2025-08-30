import { request } from './client';
import type {
  MerchantWithCategory,
  MerchantInput,
  MerchantUpdate,
  SearchParams,
  PaginatedResponse,
} from '@shared/types';

export const merchantsApi = {
  search(params: SearchParams) {
    return request<PaginatedResponse<MerchantWithCategory>>('GET', '/merchants', null, params);
  },

  getById(id: string) {
    return request<{ data: MerchantWithCategory }>('GET', `/merchants/${id}`);
  },

  getFeatured() {
    return request<{ data: MerchantWithCategory[] }>('GET', '/merchants/featured');
  },

  create(data: MerchantInput) {
    return request<{ data: MerchantWithCategory }>('POST', '/merchants', data);
  },

  update(id: string, data: MerchantUpdate) {
    return request<{ data: MerchantWithCategory }>('PATCH', `/merchants/${id}`, data);
  },

  delete(id: string) {
    return request<{ message: string }>('DELETE', `/merchants/${id}`);
  },

  bulkUpdateStatus(ids: string[], isActive: boolean) {
    return request<{ message: string }>('POST', '/merchants/bulk/status', {
      ids,
      is_active: isActive,
    });
  },

  bulkUpdateFeatured(ids: string[], isFeatured: boolean) {
    return request<{ message: string }>('POST', '/merchants/bulk/featured', {
      ids,
      is_featured: isFeatured,
    });
  },
};