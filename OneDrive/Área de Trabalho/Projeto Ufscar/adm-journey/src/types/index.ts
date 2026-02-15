// Global Types
export interface PageParams {
  params: {
    id?: string;
  };
  searchParams?: Record<string, string | string[]>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
