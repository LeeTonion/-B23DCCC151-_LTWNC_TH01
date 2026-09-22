

import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, Info, X, AlertTriangle } from 'lucide-react';
import type { ToastNotification } from '../../features/assignments/assignmentsSlice';

interface ToastProps {
  toasts: ToastNotification[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onRemove }) => {
  return (
    <div className="toast-portal">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => onRemove(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastNotification; onDismiss: () => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, toast.duration || 3500);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={18} className="toast-icon-success" />;
      case 'warning':
        return <AlertTriangle size={18} className="toast-icon-warning" />;
      case 'error':
        return <AlertCircle size={18} className="toast-icon-error" />;
      case 'info':
      default:
        return <Info size={18} className="toast-icon-info" />;
    }
  };

  return (
    <div className={`toast-card toast-${toast.type}`}>
      <span className="toast-icon-wrap">{getIcon()}</span>
      <p className="toast-msg">{toast.message}</p>
      <button
        type="button"
        className="toast-close-btn"
        onClick={onDismiss}
        aria-label="Đóng thông báo"
      >
        <X size={14} />
      </button>
    </div>
  );
};
