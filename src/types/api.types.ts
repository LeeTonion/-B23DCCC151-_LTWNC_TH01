

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface AsyncEntityState<T> {
  data: T;
  status: LoadingStatus;
  error: string | null;
  lastUpdated: number | null;
}
