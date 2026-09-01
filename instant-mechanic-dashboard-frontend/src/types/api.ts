export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: Meta;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: Meta;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}
