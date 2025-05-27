export * from './user';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sort?: string;
}