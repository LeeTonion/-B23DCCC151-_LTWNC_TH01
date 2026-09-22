/**
 * BUỔI 3: REDUX TOOLKIT + TYPESCRIPT - ASYNC THUNKS
 * File: src/features/assignments/assignmentsThunks.ts
 * Xử lý các Async Actions gọi tới Mock API
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { mockAssignmentApi } from '../../api/mockAssignmentApi';
import type { Assignment, CreateAssignmentDTO, UpdateAssignmentDTO } from '../../types/assignment.types';

/** Thunk: Tải danh sách bài tập từ mock API khi ứng dụng khởi động */
export const fetchAssignments = createAsyncThunk<
  Assignment[],
  void,
  { rejectValue: string }
>('assignments/fetchAssignments', async (_, { rejectWithValue }) => {
  try {
    const res = await mockAssignmentApi.getAllAssignments();
    return res.data;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Không thể tải danh sách bài tập';
    return rejectWithValue(errorMsg);
  }
});

/** Thunk: Thêm bài tập mới */
export const addAssignment = createAsyncThunk<
  Assignment,
  CreateAssignmentDTO,
  { rejectValue: string }
>('assignments/addAssignment', async (dto, { rejectWithValue }) => {
  try {
    const res = await mockAssignmentApi.createAssignment(dto);
    return res.data;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Không thể tạo bài tập mới';
    return rejectWithValue(errorMsg);
  }
});

/** Thunk: Đổi trạng thái hoàn thành */
export const toggleAssignment = createAsyncThunk<
  Assignment,
  string,
  { rejectValue: string }
>('assignments/toggleAssignment', async (id, { rejectWithValue }) => {
  try {
    const res = await mockAssignmentApi.toggleAssignment(id);
    return res.data;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Không thể thay đổi trạng thái';
    return rejectWithValue(errorMsg);
  }
});

/** Thunk: Cập nhật thông tin bài tập */
export const updateAssignment = createAsyncThunk<
  Assignment,
  { id: string; dto: UpdateAssignmentDTO },
  { rejectValue: string }
>('assignments/updateAssignment', async ({ id, dto }, { rejectWithValue }) => {
  try {
    const res = await mockAssignmentApi.updateAssignment(id, dto);
    return res.data;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Không thể cập nhật bài tập';
    return rejectWithValue(errorMsg);
  }
});

/** Thunk: Xóa bài tập */
export const deleteAssignment = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('assignments/deleteAssignment', async (id, { rejectWithValue }) => {
  try {
    await mockAssignmentApi.deleteAssignment(id);
    return id;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Không thể xóa bài tập';
    return rejectWithValue(errorMsg);
  }
});

/** Thunk: Khôi phục dữ liệu mẫu ban đầu */
export const resetToSampleAssignments = createAsyncThunk<
  Assignment[],
  void,
  { rejectValue: string }
>('assignments/resetToSampleAssignments', async (_, { rejectWithValue }) => {
  try {
    const res = await mockAssignmentApi.resetToSampleData();
    return res.data;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Không thể khôi phục dữ liệu mẫu';
    return rejectWithValue(errorMsg);
  }
});
