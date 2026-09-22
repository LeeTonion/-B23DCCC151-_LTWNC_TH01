/**
 * BUỔI 2: REACT DESIGN PATTERNS - HIGHER-ORDER COMPONENT (HOC)
 * File: src/patterns/hoc/withUrgencyHighlight.tsx
 * 
 * HOC tự động kiểm tra tính khẩn cấp của bài tập và bọc viền phát sáng (Glow / Pulse border)
 * cho bất kỳ Component thẻ nào
 */

import React from 'react';
import type { Assignment } from '../../types/assignment.types';
import { isDueSoon, isOverdue } from '../../types/typeGuards';

export interface WithUrgencyProps {
  assignment: Assignment;
}

export function withUrgencyHighlight<P extends WithUrgencyProps>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> {
  const WithUrgencyComponent: React.FC<P> = (props) => {
    const { assignment } = props;

    const overdue = isOverdue(assignment);
    const dueSoon = isDueSoon(assignment, 24);

    let wrapperClass = 'assignment-wrapper-standard';
    if (!assignment.isCompleted) {
      if (overdue) {
        wrapperClass = 'assignment-wrapper-overdue';
      } else if (dueSoon) {
        wrapperClass = 'assignment-wrapper-urgent';
      }
    }

    return (
      <div className={`urgency-hoc-container ${wrapperClass}`}>
        <WrappedComponent {...props} />
      </div>
    );
  };

  WithUrgencyComponent.displayName = `WithUrgencyHighlight(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithUrgencyComponent;
}
