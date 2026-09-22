

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { LoadingStatus } from '../../types/api.types';
import type {
  Assignment,
  PriorityLevel,
  SortField,
  SortOrder,
  StatusFilter,
} from '../../types/assignment.types';
import {
  addAssignment,
  deleteAssignment,
  fetchAssignments,
  resetToSampleAssignments,
  toggleAssignment,
  updateAssignment,
} from './assignmentsThunks';

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  duration?: number;
}

export interface AssignmentsState {
  items: Assignment[];
  status: LoadingStatus;
  error: string | null;

  filter: {
    status: StatusFilter;
    subject: string;
    priority: PriorityLevel | 'ALL';
    searchQuery: string;
    sortBy: SortField;
    sortOrder: SortOrder;
  };

  toasts: ToastNotification[];
}

const initialState: AssignmentsState = {
  items: [],
  status: 'idle',
  error: null,
  filter: {
    status: 'ALL',
    subject: '',
    priority: 'ALL',
    searchQuery: '',
    sortBy: 'dueDate',
    sortOrder: 'asc',
  },
  toasts: [],
};

export const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<StatusFilter>) => {
      state.filter.status = action.payload;
    },
    setSubjectFilter: (state, action: PayloadAction<string>) => {
      state.filter.subject = action.payload;
    },
    setPriorityFilter: (state, action: PayloadAction<PriorityLevel | 'ALL'>) => {
      state.filter.priority = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filter.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<SortField>) => {
      state.filter.sortBy = action.payload;
    },
    toggleSortOrder: (state) => {
      state.filter.sortOrder = state.filter.sortOrder === 'asc' ? 'desc' : 'asc';
    },
    resetFilters: (state) => {
      state.filter = {
        status: 'ALL',
        subject: '',
        priority: 'ALL',
        searchQuery: '',
        sortBy: 'dueDate',
        sortOrder: 'asc',
      };
    },
    addToast: (state, action: PayloadAction<Omit<ToastNotification, 'id'>>) => {
      const newToast: ToastNotification = {
        ...action.payload,
        id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      };
      state.toasts.push(newToast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
  extraReducers: (builder) => {

    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Lỗi khi tải dữ liệu bài tập';
      });

    builder.addCase(addAssignment.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
      state.toasts.push({
        id: `toast-${Date.now()}`,
        type: 'success',
        message: `Đã thêm bài tập: "${action.payload.title}"`,
      });
    });

    builder.addCase(toggleAssignment.fulfilled, (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      state.toasts.push({
        id: `toast-${Date.now()}`,
        type: action.payload.isCompleted ? 'success' : 'info',
        message: action.payload.isCompleted
          ? `Đã hoàn thành "${action.payload.title}"!`
          : `Đã bỏ đánh dấu hoàn thành "${action.payload.title}"`,
      });
    });

    builder.addCase(updateAssignment.fulfilled, (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      state.toasts.push({
        id: `toast-${Date.now()}`,
        type: 'success',
        message: `Đã cập nhật bài tập: "${action.payload.title}"`,
      });
    });

    builder.addCase(deleteAssignment.fulfilled, (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.toasts.push({
        id: `toast-${Date.now()}`,
        type: 'warning',
        message: 'Đã xóa bài tập khỏi danh sách',
      });
    });

    builder.addCase(resetToSampleAssignments.fulfilled, (state, action) => {
      state.items = action.payload;
      state.toasts.push({
        id: `toast-${Date.now()}`,
        type: 'info',
        message: 'Đã khôi phục dữ liệu mẫu ban đầu',
      });
    });
  },
});

export const {
  setStatusFilter,
  setSubjectFilter,
  setPriorityFilter,
  setSearchQuery,
  setSortBy,
  toggleSortOrder,
  resetFilters,
  addToast,
  removeToast,
} = assignmentsSlice.actions;

export default assignmentsSlice.reducer;
