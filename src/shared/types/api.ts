export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SearchParams extends PaginationParams {
  q?: string;
  category_id?: string;
  is_active?: boolean;
  is_featured?: boolean;
}

export interface NearbySearchParams {
  latitude: number;
  longitude: number;
  radius?: number;
}