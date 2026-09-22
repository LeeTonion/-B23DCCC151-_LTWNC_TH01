/**
 * Empty State Component
 * File: src/features/assignments/components/AssignmentEmptyState.tsx
 */

import React from 'react';
import { BookCheck, FilterX, PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  hasFilters: boolean;
  onResetFilters: () => void;
  onOpenAddModal: () => void;
}

export const AssignmentEmptyState: React.FC<EmptyStateProps> = ({
  hasFilters,
  onResetFilters,
  onOpenAddModal,
}) => {
  return (
    <div className="empty-state-card">
      <div className="empty-state-icon-wrap">
        {hasFilters ? (
          <FilterX size={42} className="empty-state-icon" />
        ) : (
          <BookCheck size={42} className="empty-state-icon-success" />
        )}
      </div>

      <h3 className="empty-state-title">
        {hasFilters
          ? 'Không tìm thấy bài tập phù hợp'
          : 'Tuyệt vời! Không còn bài tập nào cần làm'}
      </h3>

      <p className="empty-state-desc">
        {hasFilters
          ? 'Thử thay đổi bộ lọc trạng thái, môn học hoặc từ khóa tìm kiếm của bạn.'
          : 'Bạn đã hoàn tất tất cả deadline hoặc chưa tạo bài tập mới nào.'}
      </p>

      <div className="empty-state-actions">
        {hasFilters ? (
          <button
            type="button"
            className="btn-secondary"
            onClick={onResetFilters}
          >
            Đặt lại bộ lọc
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary"
            onClick={onOpenAddModal}
          >
            <PlusCircle size={16} />
            <span>Thêm bài tập đầu tiên</span>
          </button>
        )}
      </div>
    </div>
  );
};
