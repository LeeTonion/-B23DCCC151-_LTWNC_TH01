

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
      
      <ToastContainer toasts={toasts} onRemove={handleRemoveToast} />

      <Header
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onResetData={handleResetData}
        isLoading={status === 'loading'}
      />

      <main className="main-content-container">
        
        <AssignmentStats />

        <AssignmentFilterBar />

        <AssignmentList onOpenAddModal={() => setIsAddModalOpen(true)} />
      </main>

      <AssignmentFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <footer className="app-footer">
        <p>
          Student Deadline Tracker • Lập trình Web Nâng Cao • React 19 + Redux Toolkit + TypeScript
        </p>
      </footer>
    </div>
  );
};

export default App;
