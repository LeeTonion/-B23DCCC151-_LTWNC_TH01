/**
 * BUỔI 1: TYPESCRIPT NÂNG CAO - GENERICS
 * File: src/types/api.types.ts
 * Minh họa Generic Response Types & Async Loading State
 */

/** Cấu trúc phản hồi API chuẩn hóa với Generic Type <T> */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  statusCode: number;
}

/** Cấu trúc phản hồi phân trang Generic */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Generic Async Status State cho Redux Store */
export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface AsyncEntityState<T> {
  data: T;
  status: LoadingStatus;
  error: string | null;
  lastUpdated: number | null;
}
