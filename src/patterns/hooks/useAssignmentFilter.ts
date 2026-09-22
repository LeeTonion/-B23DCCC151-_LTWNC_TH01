/**
 * BUỔI 2: REACT DESIGN PATTERNS - CUSTOM HOOKS
 * File: src/patterns/hooks/useAssignmentFilter.ts
 * Quản lý logic lọc, tìm kiếm và sắp xếp danh sách bài tập
 */

import { useMemo, useState } from 'react';
import type {
  Assignment,
  PriorityLevel,
  SortField,
  SortOrder,
  StatusFilter,
} from '../../types/assignment.types';
import { isOverdue } from '../../types/typeGuards';
import { PRIORITY_CONFIG } from '../../utils/dateUtils';
import { useDebounce } from './useDebounce';

export interface FilterState {
  status: StatusFilter;
  subject: string; // '' nghĩa là tất cả môn
  priority: PriorityLevel | 'ALL';
  searchQuery: string;
  sortBy: SortField;
  sortOrder: SortOrder;
}

export function useAssignmentFilter(assignments: Assignment[]) {
  const [filterState, setFilterState] = useState<FilterState>({
    status: 'ALL',
    subject: '',
    priority: 'ALL',
    searchQuery: '',
    sortBy: 'dueDate',
    sortOrder: 'asc',
  });

  const debouncedSearch = useDebounce(filterState.searchQuery, 250);

  // Danh sách các môn học duy nhất có trong hệ thống
  const uniqueSubjects = useMemo(() => {
    const set = new Set(assignments.map((a) => a.subject.trim()));
    return Array.from(set).filter(Boolean).sort();
  }, [assignments]);

  // Thống kê nhanh số lượng theo từng bộ lọc
  const stats = useMemo(() => {
    const total = assignments.length;
    const completed = assignments.filter((a) => a.isCompleted).length;
    const overdue = assignments.filter((a) => isOverdue(a)).length;
    const pending = assignments.filter((a) => !a.isCompleted && !isOverdue(a)).length;
    const highPriorityPending = assignments.filter(
      (a) => !a.isCompleted && a.priority === 'HIGH'
    ).length;

    return {
      total,
      completed,
      overdue,
      pending,
      highPriorityPending,
    };
  }, [assignments]);

  // Áp dụng bộ lọc và sắp xếp
  const filteredAssignments = useMemo(() => {
    return assignments
      .filter((item) => {
        // 1. Lọc theo trạng thái
        if (filterState.status === 'COMPLETED' && !item.isCompleted) return false;
        if (filterState.status === 'PENDING' && (item.isCompleted || isOverdue(item))) return false;
        if (filterState.status === 'OVERDUE' && !isOverdue(item)) return false;

        // 2. Lọc theo môn học
        if (filterState.subject && item.subject !== filterState.subject) return false;

        // 3. Lọc theo mức độ ưu tiên
        if (filterState.priority !== 'ALL' && item.priority !== filterState.priority) return false;

        // 4. Tìm kiếm từ khóa (tên bài tập, môn học, ghi chú)
        if (debouncedSearch) {
          const q = debouncedSearch.toLowerCase().trim();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchSubject = item.subject.toLowerCase().includes(q);
          const matchDesc = item.description ? item.description.toLowerCase().includes(q) : false;
          if (!matchTitle && !matchSubject && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let comparison = 0;

        switch (filterState.sortBy) {
          case 'dueDate': {
            const timeA = new Date(a.dueDate).getTime();
            const timeB = new Date(b.dueDate).getTime();
            comparison = timeA - timeB;
            break;
          }
          case 'priority': {
            const weightA = PRIORITY_CONFIG[a.priority].weight;
            const weightB = PRIORITY_CONFIG[b.priority].weight;
            comparison = weightB - weightA; // Cao hơn đứng trước
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

        return filterState.sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [assignments, filterState.status, filterState.subject, filterState.priority, filterState.sortBy, filterState.sortOrder, debouncedSearch]);

  const setStatus = (status: StatusFilter) => setFilterState((prev) => ({ ...prev, status }));
  const setSubject = (subject: string) => setFilterState((prev) => ({ ...prev, subject }));
  const setPriority = (priority: PriorityLevel | 'ALL') => setFilterState((prev) => ({ ...prev, priority }));
  const setSearchQuery = (searchQuery: string) => setFilterState((prev) => ({ ...prev, searchQuery }));
  const setSortBy = (sortBy: SortField) => setFilterState((prev) => ({ ...prev, sortBy }));
  const toggleSortOrder = () =>
    setFilterState((prev) => ({ ...prev, sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' }));
  const resetFilters = () =>
    setFilterState({
      status: 'ALL',
      subject: '',
      priority: 'ALL',
      searchQuery: '',
      sortBy: 'dueDate',
      sortOrder: 'asc',
    });

  return {
    filterState,
    filteredAssignments,
    uniqueSubjects,
    stats,
    setStatus,
    setSubject,
    setPriority,
    setSearchQuery,
    setSortBy,
    toggleSortOrder,
    resetFilters,
  };
}
