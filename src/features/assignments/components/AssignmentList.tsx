/**
 * Assignment List Component
 * File: src/features/assignments/components/AssignmentList.tsx
 * 
 * Sử dụng Compound Component (AssignmentCard) kết hợp HOC (withUrgencyHighlight)
 */

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { AssignmentCard } from '../../../patterns/compound/AssignmentCard';
import { withUrgencyHighlight } from '../../../patterns/hoc/withUrgencyHighlight';
import type { Assignment } from '../../../types/assignment.types';
import {
  selectAssignmentsStatus,
  selectFilterState,
  selectFilteredAssignments,
} from '../assignmentsSelectors';
import { resetFilters } from '../assignmentsSlice';
import { deleteAssignment, toggleAssignment } from '../assignmentsThunks';
import { AssignmentEmptyState } from './AssignmentEmptyState';
import { AssignmentFormModal } from './AssignmentFormModal';

interface AssignmentItemProps {
  assignment: Assignment;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (assignment: Assignment) => void;
}

// ----------------------------------------------------------------------
// Áp dụng Compound Component + HOC withUrgencyHighlight
// ----------------------------------------------------------------------
const AssignmentItemWithHOC = withUrgencyHighlight<AssignmentItemProps>(
  ({ assignment, onToggle, onDelete, onEdit }) => {
    return (
      <AssignmentCard
        assignment={assignment}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      >
        <AssignmentCard.Header />
        <AssignmentCard.Title />
        <AssignmentCard.Countdown />
        <AssignmentCard.Meta />
        <AssignmentCard.Actions />
      </AssignmentCard>
    );
  }
);

export const AssignmentList: React.FC<{ onOpenAddModal: () => void }> = ({
  onOpenAddModal,
}) => {
  const dispatch = useAppDispatch();
  const assignments = useAppSelector(selectFilteredAssignments);
  const status = useAppSelector(selectAssignmentsStatus);
  const filter = useAppSelector(selectFilterState);

  // Modal State
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    dispatch(toggleAssignment(id));
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      dispatch(deleteAssignment(deletingId));
      setDeletingId(null);
    }
  };

  const hasFilters =
    filter.status !== 'ALL' ||
    filter.subject !== '' ||
    filter.priority !== 'ALL' ||
    filter.searchQuery !== '';

  // Đang tải dữ liệu ban đầu
  if (status === 'loading' && assignments.length === 0) {
    return (
      <div className="loading-container">
        <Loader2 size={36} className="loading-spinner" />
        <p className="loading-text">Đang tải danh sách bài tập từ hệ thống...</p>
      </div>
    );
  }

  // Danh sách rỗng
  if (assignments.length === 0) {
    return (
      <AssignmentEmptyState
        hasFilters={hasFilters}
        onResetFilters={() => dispatch(resetFilters())}
        onOpenAddModal={onOpenAddModal}
      />
    );
  }

  return (
    <>
      <div className="assignments-grid">
        {assignments.map((assignment) => (
          <AssignmentItemWithHOC
            key={assignment.id}
            assignment={assignment}
            onToggle={handleToggle}
            onDelete={(id) => setDeletingId(id)}
            onEdit={(item) => setEditingAssignment(item)}
          />
        ))}
      </div>

      {/* Edit Form Modal */}
      <AssignmentFormModal
        isOpen={Boolean(editingAssignment)}
        onClose={() => setEditingAssignment(null)}
        editingAssignment={editingAssignment}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Xóa bài tập này?"
        message="Hành động này sẽ xóa vĩnh viễn bài tập khỏi danh sách theo dõi của bạn. Bạn có chắc chắn muốn tiếp tục?"
        confirmText="Xác nhận xóa"
      />
    </>
  );
};
