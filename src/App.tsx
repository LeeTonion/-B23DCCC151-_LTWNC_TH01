/**
 * Root Application Component
 * File: src/App.tsx
 */

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { Header } from './components/common/Header';
import { ToastContainer } from './components/common/Toast';
import { AssignmentFilterBar } from './features/assignments/components/AssignmentFilterBar';
import { AssignmentFormModal } from './features/assignments/components/AssignmentFormModal';
import { AssignmentList } from './features/assignments/components/AssignmentList';
import { AssignmentStats } from './features/assignments/components/AssignmentStats';
import {
  selectAssignmentsStatus,
  selectToasts,
} from './features/assignments/assignmentsSelectors';
import { removeToast } from './features/assignments/assignmentsSlice';
import {
  fetchAssignments,
  resetToSampleAssignments,
} from './features/assignments/assignmentsThunks';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAssignmentsStatus);
  const toasts = useAppSelector(selectToasts);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // YÊU CẦU 7: Khi khởi động app, lấy danh sách mẫu ban đầu từ 1 API giả lập
  useEffect(() => {
    dispatch(fetchAssignments());
  }, [dispatch]);

  const handleResetData = () => {
    dispatch(resetToSampleAssignments());
  };

  const handleRemoveToast = (id: string) => {
    dispatch(removeToast(id));
  };

  return (
    <div className="app-layout">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={handleRemoveToast} />

      {/* Top Header */}
      <Header
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onResetData={handleResetData}
        isLoading={status === 'loading'}
      />

      {/* Main Container */}
      <main className="main-content-container">
        {/* Stats Overview */}
        <AssignmentStats />

        {/* Filter & Control Bar */}
        <AssignmentFilterBar />

        {/* Assignments Grid / List */}
        <AssignmentList onOpenAddModal={() => setIsAddModalOpen(true)} />
      </main>

      {/* Modal Thêm Bài Tập Mới */}
      <AssignmentFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Student Deadline Tracker • Lập trình Web Nâng Cao • React 19 + Redux Toolkit + TypeScript
        </p>
      </footer>
    </div>
  );
};

export default App;
