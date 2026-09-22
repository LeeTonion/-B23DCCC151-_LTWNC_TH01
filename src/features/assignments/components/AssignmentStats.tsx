/**
 * Assignment Stats Banner Component
 * File: src/features/assignments/components/AssignmentStats.tsx
 */

import React from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  Percent,
} from 'lucide-react';
import { useAppSelector } from '../../../app/hooks';
import { selectAssignmentStats } from '../assignmentsSelectors';

export const AssignmentStats: React.FC = () => {
  const stats = useAppSelector(selectAssignmentStats);

  return (
    <section className="stats-section">
      <div className="stats-grid">
        {/* Card 1: Tổng bài tập */}
        <div className="stat-card stat-total">
          <div className="stat-icon-wrap">
            <BookOpen size={22} className="stat-icon" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Tổng bài tập</span>
            <div className="stat-value-row">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-sub">bài</span>
            </div>
          </div>
        </div>

        {/* Card 2: Đang thực hiện */}
        <div className="stat-card stat-pending">
          <div className="stat-icon-wrap">
            <Clock size={22} className="stat-icon" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Đang thực hiện</span>
            <div className="stat-value-row">
              <span className="stat-value">{stats.pending}</span>
              <span className="stat-sub">chưa xong</span>
            </div>
          </div>
        </div>

        {/* Card 3: Cần nộp gấp (<24h) */}
        <div className="stat-card stat-urgent">
          <div className="stat-icon-wrap">
            <Flame size={22} className="stat-icon" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Cần nộp gấp (&lt;24h)</span>
            <div className="stat-value-row">
              <span className="stat-value">{stats.dueSoon}</span>
              <span className="stat-sub">khẩn cấp</span>
            </div>
          </div>
        </div>

        {/* Card 4: Quá hạn */}
        <div className="stat-card stat-overdue">
          <div className="stat-icon-wrap">
            <AlertCircle size={22} className="stat-icon" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Quá hạn nộp</span>
            <div className="stat-value-row">
              <span className="stat-value">{stats.overdue}</span>
              <span className="stat-sub">trễ hạn</span>
            </div>
          </div>
        </div>

        {/* Card 5: Đã hoàn thành */}
        <div className="stat-card stat-completed">
          <div className="stat-icon-wrap">
            <CheckCircle2 size={22} className="stat-icon" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Đã hoàn thành</span>
            <div className="stat-value-row">
              <span className="stat-value">{stats.completed}</span>
              <span className="stat-sub">({stats.completionRate}%)</span>
            </div>
            {/* Progress bar */}
            <div className="stat-progress-bg">
              <div
                className="stat-progress-fill"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
