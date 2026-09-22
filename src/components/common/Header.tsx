

import React from 'react';
import { PlusCircle, RotateCcw, Clock, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenAddModal: () => void;
  onResetData: () => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onResetData,
  isLoading,
}) => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-branding">
          <div className="brand-icon-wrap">
            <Clock size={28} className="brand-icon" />
          </div>
          <div className="brand-text">
            <div className="brand-title-wrap">
              <h1 className="brand-title">Student Deadline Tracker</h1>
              <span className="brand-tag">v1.0 Pro</span>
            </div>
            <p className="brand-subtitle">
              Hệ thống theo dõi và quản lý hạn nộp bài tập thông minh
            </p>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onResetData}
            disabled={isLoading}
            title="Khôi phục danh sách bài tập mẫu ban đầu"
          >
            <RotateCcw size={16} className={isLoading ? 'spin-icon' : ''} />
            <span>Nạp dữ liệu mẫu</span>
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={onOpenAddModal}
          >
            <PlusCircle size={18} />
            <span>Thêm bài tập mới</span>
          </button>
        </div>
      </div>
    </header>
  );
};
