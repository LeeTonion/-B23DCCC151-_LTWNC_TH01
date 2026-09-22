

import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Sparkles, Tag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Modal } from '../../../components/common/Modal';
import { CustomDateTimePicker } from '../../../components/common/CustomDateTimePicker';
import { useFormValidation, type ValidationSchema } from '../../../patterns/hooks/useFormValidation';
import type { Assignment, CreateAssignmentDTO, PriorityLevel } from '../../../types/assignment.types';
import { PRIORITY_CONFIG, toLocalDatetimeInputString } from '../../../utils/dateUtils';
import { selectUniqueSubjects } from '../assignmentsSelectors';
import { addAssignment, updateAssignment } from '../assignmentsThunks';

interface AssignmentFormData {
  subject: string;
  title: string;
  dueDate: string;
  priority: PriorityLevel;
  description: string;
}

interface AssignmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingAssignment?: Assignment | null;
}

const validationSchema: ValidationSchema<AssignmentFormData> = {
  subject: (val) => {
    if (!val || !val.trim()) return 'Vui lòng nhập hoặc chọn tên môn học';
    if (val.trim().length < 2) return 'Tên môn học phải có ít nhất 2 ký tự';
    return null;
  },
  title: (val) => {
    if (!val || !val.trim()) return 'Vui lòng nhập tên bài tập / đồ án';
    if (val.trim().length < 3) return 'Tên bài tập phải có ít nhất 3 ký tự';
    return null;
  },
  dueDate: (val) => {
    if (!val) return 'Vui lòng chọn hạn chót nộp bài';
    const date = new Date(val);
    if (isNaN(date.getTime())) return 'Ngày giờ không hợp lệ';
    return null;
  },
};

export const AssignmentFormModal: React.FC<AssignmentFormModalProps> = ({
  isOpen,
  onClose,
  editingAssignment,
}) => {
  const dispatch = useAppDispatch();
  const subjects = useAppSelector(selectUniqueSubjects);

  const getDefaultDueDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 0, 0);
    return toLocalDatetimeInputString(tomorrow);
  };

  const initialValues: AssignmentFormData = {
    subject: '',
    title: '',
    dueDate: getDefaultDueDate(),
    priority: 'MEDIUM',
    description: '',
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
  } = useFormValidation<AssignmentFormData>({
    initialValues,
    validationSchema,
    onSubmit: async (formValues) => {
      
      const isoDueDate = new Date(formValues.dueDate).toISOString();

      if (editingAssignment) {
        await dispatch(
          updateAssignment({
            id: editingAssignment.id,
            dto: {
              subject: formValues.subject.trim(),
              title: formValues.title.trim(),
              dueDate: isoDueDate,
              priority: formValues.priority,
              description: formValues.description.trim() || undefined,
            },
          })
        );
      } else {
        const dto: CreateAssignmentDTO = {
          subject: formValues.subject.trim(),
          title: formValues.title.trim(),
          dueDate: isoDueDate,
          priority: formValues.priority,
          description: formValues.description.trim() || undefined,
        };
        await dispatch(addAssignment(dto));
      }

      onClose();
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (editingAssignment) {
        setValues({
          subject: editingAssignment.subject,
          title: editingAssignment.title,
          dueDate: toLocalDatetimeInputString(new Date(editingAssignment.dueDate)),
          priority: editingAssignment.priority,
          description: editingAssignment.description || '',
        });
      } else {
        resetForm({
          subject: subjects[0] || 'Lập trình Web Nâng Cao',
          title: '',
          dueDate: getDefaultDueDate(),
          priority: 'MEDIUM',
          description: '',
        });
      }
    }
  }, [isOpen, editingAssignment]);

  const setQuickDueDate = (daysToAdd: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysToAdd);
    target.setHours(23, 59, 0, 0);
    handleChange('dueDate', toLocalDatetimeInputString(target));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingAssignment ? 'Chỉnh Sửa Bài Tập' : 'Thêm Bài Tập Mới'}
      subtitle={
        editingAssignment
          ? 'Cập nhật lại hạn nộp hoặc độ ưu tiên cho bài tập'
          : 'Điền thông tin deadline để hệ thống tự động theo dõi và nhắc nhở'
      }
      maxWidth="580px"
    >
      <form onSubmit={handleSubmit} className="assignment-form" noValidate>
        
        <div className="form-group">
          <label className="form-label" htmlFor="subject">
            Môn học <span className="required">*</span>
          </label>
          <div className="input-with-suggestions">
            <input
              id="subject"
              type="text"
              className={`form-input ${touched.subject && errors.subject ? 'input-error' : ''}`}
              placeholder="VD: Lập trình Web Nâng Cao, Trí tuệ Nhân tạo..."
              list="subject-suggestions"
              value={values.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              onBlur={() => handleBlur('subject')}
            />
            <datalist id="subject-suggestions">
              {subjects.map((subj) => (
                <option key={subj} value={subj} />
              ))}
            </datalist>
          </div>
          {touched.subject && errors.subject && (
            <p className="field-error-msg">{errors.subject}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="title">
            Tên bài tập / Đồ án <span className="required">*</span>
          </label>
          <input
            id="title"
            type="text"
            className={`form-input ${touched.title && errors.title ? 'input-error' : ''}`}
            placeholder="VD: Lab 4 - Redux Toolkit, Báo cáo tiến độ đồ án..."
            value={values.title}
            onChange={(e) => handleChange('title', e.target.value)}
            onBlur={() => handleBlur('title')}
          />
          {touched.title && errors.title && (
            <p className="field-error-msg">{errors.title}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="dueDate">
            Hạn nộp (Ngày & Giờ) <span className="required">*</span>
          </label>
          <CustomDateTimePicker
            value={values.dueDate}
            onChange={(val) => handleChange('dueDate', val)}
            onBlur={() => handleBlur('dueDate')}
            hasError={Boolean(touched.dueDate && errors.dueDate)}
          />
          {touched.dueDate && errors.dueDate && (
            <p className="field-error-msg">{errors.dueDate}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Độ ưu tiên <span className="required">*</span>
          </label>
          <div className="priority-select-cards">
            {(['HIGH', 'MEDIUM', 'LOW'] as PriorityLevel[]).map((lvl) => {
              const cfg = PRIORITY_CONFIG[lvl];
              const isSelected = values.priority === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  className={`priority-select-card ${isSelected ? 'selected' : ''}`}
                  style={{
                    borderColor: isSelected ? cfg.color : undefined,
                    backgroundColor: isSelected ? cfg.bg : undefined,
                  }}
                  onClick={() => handleChange('priority', lvl)}
                >
                  <span
                    className="priority-dot"
                    style={{ backgroundColor: cfg.color }}
                  />
                  <span className="priority-select-name">{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">
            Ghi chú / Yêu cầu chi tiết (Tùy chọn)
          </label>
          <textarea
            id="description"
            rows={3}
            className="form-textarea"
            placeholder="VD: Nhớ nộp kèm file báo cáo PDF, chạy unit test trước khi nộp..."
            value={values.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>

        <div className="modal-actions-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>Đang lưu...</span>
            ) : editingAssignment ? (
              <span>Lưu thay đổi</span>
            ) : (
              <span>Tạo bài tập</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
