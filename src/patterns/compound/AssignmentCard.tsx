/**
 * BUỔI 2: REACT DESIGN PATTERNS - COMPOUND COMPONENT PATTERN
 * File: src/patterns/compound/AssignmentCard.tsx
 * 
 * Pattern minh họa:
 * <AssignmentCard assignment={item} onToggle={...} onDelete={...} onEdit={...}>
 *   <AssignmentCard.Header />
 *   <AssignmentCard.Title />
 *   <AssignmentCard.Countdown />
 *   <AssignmentCard.Meta />
 *   <AssignmentCard.Actions />
 * </AssignmentCard>
 */

import React, { createContext, useContext } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  Flame,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import type { Assignment } from '../../types/assignment.types';
import { formatFullDateTime, PRIORITY_CONFIG } from '../../utils/dateUtils';
import { useDeadlineCountdown } from '../hooks/useDeadlineCountdown';

interface AssignmentCardContextType {
  assignment: Assignment;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (assignment: Assignment) => void;
}

const AssignmentCardContext = createContext<AssignmentCardContextType | undefined>(undefined);

function useCardContext() {
  const context = useContext(AssignmentCardContext);
  if (!context) {
    throw new Error('Các sub-component của AssignmentCard phải được đặt bên trong <AssignmentCard>');
  }
  return context;
}

// -------------------------------------------------------------
// 1. CONTAINER CHÍNH
// -------------------------------------------------------------
interface AssignmentCardProps {
  assignment: Assignment;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (assignment: Assignment) => void;
  className?: string;
  children: React.ReactNode;
}

export const AssignmentCard: React.FC<AssignmentCardProps> & {
  Header: React.FC<{ className?: string }>;
  Title: React.FC<{ className?: string }>;
  Countdown: React.FC<{ className?: string }>;
  Meta: React.FC<{ className?: string }>;
  Actions: React.FC<{ className?: string }>;
} = ({ assignment, onToggle, onDelete, onEdit, className = '', children }) => {
  const isCompleted = assignment.isCompleted;

  return (
    <AssignmentCardContext.Provider value={{ assignment, onToggle, onDelete, onEdit }}>
      <div
        className={`assignment-card ${isCompleted ? 'assignment-card-completed' : ''} ${className}`}
        data-id={assignment.id}
      >
        {children}
      </div>
    </AssignmentCardContext.Provider>
  );
};

// -------------------------------------------------------------
// 2. SUB-COMPONENT: HEADER
// -------------------------------------------------------------
AssignmentCard.Header = function AssignmentCardHeader({ className = '' }) {
  const { assignment } = useCardContext();
  const priorityInfo = PRIORITY_CONFIG[assignment.priority];

  return (
    <div className={`card-header-row ${className}`}>
      <span className="subject-badge">{assignment.subject}</span>
      <span
        className={`priority-badge ${priorityInfo.badgeClass}`}
        style={{
          color: priorityInfo.color,
          backgroundColor: priorityInfo.bg,
          borderColor: priorityInfo.border,
        }}
      >
        {assignment.priority === 'HIGH' && <Flame size={13} className="inline-icon" />}
        {priorityInfo.label}
      </span>
    </div>
  );
};

// -------------------------------------------------------------
// 3. SUB-COMPONENT: TITLE
// -------------------------------------------------------------
AssignmentCard.Title = function AssignmentCardTitle({ className = '' }) {
  const { assignment, onToggle } = useCardContext();

  return (
    <div className={`card-title-row ${className}`}>
      <button
        type="button"
        className={`status-checkbox-btn ${assignment.isCompleted ? 'checked' : ''}`}
        onClick={() => onToggle(assignment.id)}
        aria-label={assignment.isCompleted ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
      >
        <CheckCircle2 size={20} className="check-icon" />
      </button>
      <h3 className={`assignment-title ${assignment.isCompleted ? 'title-completed' : ''}`}>
        {assignment.title}
      </h3>
    </div>
  );
};

// -------------------------------------------------------------
// 4. SUB-COMPONENT: COUNTDOWN / TIME REMAINING
// -------------------------------------------------------------
AssignmentCard.Countdown = function AssignmentCardCountdown({ className = '' }) {
  const { assignment } = useCardContext();
  const countdown = useDeadlineCountdown(assignment.dueDate, assignment.isCompleted);

  const getTierBadge = () => {
    if (assignment.isCompleted) {
      return {
        icon: <CheckCircle2 size={14} />,
        text: 'Đã hoàn tất',
        className: 'badge-completed',
      };
    }
    switch (countdown.tier) {
      case 'OVERDUE':
        return {
          icon: <AlertCircle size={14} />,
          text: countdown.label,
          className: 'badge-overdue',
        };
      case 'URGENT':
        return {
          icon: <Flame size={14} />,
          text: `${countdown.label} (Gấp!)`,
          className: 'badge-urgent',
        };
      case 'WARNING':
        return {
          icon: <Clock size={14} />,
          text: countdown.label,
          className: 'badge-warning',
        };
      case 'NORMAL':
      default:
        return {
          icon: <Clock size={14} />,
          text: countdown.label,
          className: 'badge-normal',
        };
    }
  };

  const badge = getTierBadge();

  return (
    <div className={`countdown-badge-wrapper ${className}`}>
      <div className={`countdown-badge ${badge.className}`}>
        <span className="badge-icon">{badge.icon}</span>
        <span className="badge-text font-mono">{badge.text}</span>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 5. SUB-COMPONENT: META (DUE DATE & DESCRIPTION)
// -------------------------------------------------------------
AssignmentCard.Meta = function AssignmentCardMeta({ className = '' }) {
  const { assignment } = useCardContext();

  return (
    <div className={`card-meta-block ${className}`}>
      <div className="due-date-text">
        <Calendar size={14} className="meta-icon" />
        <span>Hạn: {formatFullDateTime(assignment.dueDate)}</span>
      </div>
      {assignment.description && (
        <p className="assignment-desc">{assignment.description}</p>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 6. SUB-COMPONENT: ACTIONS (EDIT & DELETE)
// -------------------------------------------------------------
AssignmentCard.Actions = function AssignmentCardActions({ className = '' }) {
  const { assignment, onDelete, onEdit } = useCardContext();

  return (
    <div className={`card-actions-row ${className}`}>
      {onEdit && (
        <button
          type="button"
          className="action-icon-btn edit-btn"
          onClick={() => onEdit(assignment)}
          title="Chỉnh sửa bài tập"
        >
          <Edit2 size={16} />
        </button>
      )}
      <button
        type="button"
        className="action-icon-btn delete-btn"
        onClick={() => onDelete(assignment.id)}
        title="Xóa bài tập"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};
