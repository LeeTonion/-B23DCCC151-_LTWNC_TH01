/**
 * BUỔI 3: REDUX TOOLKIT - MEMOIZED SELECTORS
 * File: src/features/assignments/assignmentsSelectors.ts
 * Sử dụng createSelector để tối ưu hóa tính toán và tránh re-render
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { isDueSoon, isOverdue } from '../../types/typeGuards';
import { PRIORITY_CONFIG } from '../../utils/dateUtils';

// Base selectors
export const selectAllAssignments = (state: RootState) => state.assignments.items;
export const selectAssignmentsStatus = (state: RootState) => state.assignments.status;
export const selectAssignmentsError = (state: RootState) => state.assignments.error;
export const selectFilterState = (state: RootState) => state.assignments.filter;
export const selectToasts = (state: RootState) => state.assignments.toasts;

/** Memoized Selector: Danh sách môn học duy nhất */
export const selectUniqueSubjects = createSelector(
  [selectAllAssignments],
  (items) => {
    const set = new Set(items.map((a) => a.subject.trim()));
    return Array.from(set).filter(Boolean).sort();
  }
);

/** Memoized Selector: Thống kê tổng quan số lượng bài tập */
export const selectAssignmentStats = createSelector(
  [selectAllAssignments],
  (items) => {
    const total = items.length;
    const completed = items.filter((a) => a.isCompleted).length;
    const overdue = items.filter((a) => isOverdue(a)).length;
    const pending = items.filter((a) => !a.isCompleted && !isOverdue(a)).length;
    const dueSoon = items.filter((a) => isDueSoon(a, 24)).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      overdue,
      pending,
      dueSoon,
      completionRate,
    };
  }
);

/** Memoized Selector: Danh sách bài tập sau khi lọc và sắp xếp */
export const selectFilteredAssignments = createSelector(
  [selectAllAssignments, selectFilterState],
  (items, filter) => {
    const q = filter.searchQuery.toLowerCase().trim();

    return items
      .filter((item) => {
        // 1. Trạng thái
        if (filter.status === 'COMPLETED' && !item.isCompleted) return false;
        if (filter.status === 'PENDING' && (item.isCompleted || isOverdue(item))) return false;
        if (filter.status === 'OVERDUE' && !isOverdue(item)) return false;

        // 2. Môn học
        if (filter.subject && item.subject !== filter.subject) return false;

        // 3. Mức độ ưu tiên
        if (filter.priority !== 'ALL' && item.priority !== filter.priority) return false;

        // 4. Tìm kiếm từ khóa
        if (q) {
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchSubject = item.subject.toLowerCase().includes(q);
          const matchDesc = item.description ? item.description.toLowerCase().includes(q) : false;
          if (!matchTitle && !matchSubject && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let comparison = 0;

        switch (filter.sortBy) {
          case 'dueDate': {
            const timeA = new Date(a.dueDate).getTime();
            const timeB = new Date(b.dueDate).getTime();
            comparison = timeA - timeB;
            break;
          }
          case 'priority': {
            const weightA = PRIORITY_CONFIG[a.priority].weight;
            const weightB = PRIORITY_CONFIG[b.priority].weight;
            comparison = weightB - weightA;
            break;
          }
          case 'title': {
            comparison = a.title.localeCompare(b.title, 'vi');
            break;
          }
          case 'createdAt': {
            const timeA = new Date(a.createdAt).getTime();
            const timeB = new Date(b.createdAt).getTime();
            comparison = timeB - timeA;
            break;
          }
        }

        return filter.sortOrder === 'asc' ? comparison : -comparison;
      });
  }
);
