/**
 * Assignment Filter Bar Component
 * File: src/features/assignments/components/AssignmentFilterBar.tsx
 */

import React from 'react';
import {
  ArrowDownAZ,
  ArrowUpDown,
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import type { PriorityLevel, SortField, StatusFilter } from '../../../types/assignment.types';
import {
  resetFilters,
  setPriorityFilter,
  setSearchQuery,
  setSortBy,
  setStatusFilter,
  setSubjectFilter,
  toggleSortOrder,
} from '../assignmentsSlice';
import {
  selectAssignmentStats,
  selectFilterState,
  selectUniqueSubjects,
} from '../assignmentsSelectors';

export const AssignmentFilterBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilterState);
  const stats = useAppSelector(selectAssignmentStats);
  const subjects = useAppSelector(selectUniqueSubjects);

  const statusTabs: { key: StatusFilter; label: string; count: number }[] = [
    { key: 'ALL', label: 'Tất cả', count: stats.total },
    { key: 'PENDING', label: 'Chưa hoàn thành', count: stats.pending },
    { key: 'OVERDUE', label: 'Quá hạn', count: stats.overdue },
    { key: 'COMPLETED', label: 'Đã hoàn thành', count: stats.completed },
  ];

  const hasActiveFilter =
    filter.status !== 'ALL' ||
    filter.subject !== '' ||
    filter.priority !== 'ALL' ||
    filter.searchQuery !== '';

  return (
    <div className="filter-bar-container">
      {/* Row 1: Status Filter Tabs (Compound-like Tab Bar) */}
      <div className="status-tabs-row">
        <div className="status-tabs-list">
          {statusTabs.map((tab) => {
            const isActive = filter.status === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                className={`status-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => dispatch(setStatusFilter(tab.key))}
              >
                <span>{tab.label}</span>
                <span className={`tab-count-badge ${isActive ? 'badge-active' : ''}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {hasActiveFilter && (
          <button
            type="button"
            className="btn-reset-filters"
            onClick={() => dispatch(resetFilters())}
            title="Xóa toàn bộ bộ lọc"
          >
            <RotateCcw size={14} />
            <span>Đặt lại bộ lọc</span>
          </button>
        )}
      </div>

      {/* Row 2: Search and Dropdown Filters */}
      <div className="filter-controls-row">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm theo tên bài tập, môn học..."
            value={filter.searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
          {filter.searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => dispatch(setSearchQuery(''))}
              aria-label="Xóa từ khóa"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="dropdowns-group">
          {/* Lọc theo môn học */}
          <div className="select-wrapper">
            <select
              className="custom-select"
              value={filter.subject}
              onChange={(e) => dispatch(setSubjectFilter(e.target.value))}
            >
              <option value="">Tất cả môn học ({subjects.length})</option>
              {subjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          {/* Lọc theo độ ưu tiên */}
          <div className="select-wrapper">
            <select
              className="custom-select"
              value={filter.priority}
              onChange={(e) =>
                dispatch(setPriorityFilter(e.target.value as PriorityLevel | 'ALL'))
              }
            >
              <option value="ALL">Mọi độ ưu tiên</option>
              <option value="HIGH">Ưu tiên Cao</option>
              <option value="MEDIUM">Ưu tiên Trung bình</option>
              <option value="LOW">Ưu tiên Thấp</option>
            </select>
          </div>

          {/* Sắp xếp */}
          <div className="select-wrapper">
            <select
              className="custom-select"
              value={filter.sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value as SortField))}
            >
              <option value="dueDate">Hạn nộp</option>
              <option value="priority">Độ ưu tiên</option>
              <option value="title">Tên A-Z</option>
              <option value="createdAt">Ngày tạo</option>
            </select>
          </div>

          {/* Nút đảo chiều sắp xếp (Asc/Desc) */}
          <button
            type="button"
            className="sort-order-btn"
            onClick={() => dispatch(toggleSortOrder())}
            title={filter.sortOrder === 'asc' ? 'Tăng dần (Click để đổi sang Giảm dần)' : 'Giảm dần (Click để đổi sang Tăng dần)'}
          >
            <ArrowUpDown size={16} />
            <span className="sort-order-text">
              {filter.sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
