/**
 * BUỔI 1: TYPESCRIPT NÂNG CAO
 * File: src/types/assignment.types.ts
 * Minh họa: Enums/Unions, Interfaces, Utility Types (Omit, Pick, Partial, Record, Readonly)
 */

export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type StatusFilter = 'ALL' | 'PENDING' | 'OVERDUE' | 'COMPLETED';

export type SortField = 'dueDate' | 'priority' | 'title' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface Assignment {
  id: string;
  subject: string;       // Môn học (VD: Lập trình Web Nâng Cao, Cơ sở Dữ liệu...)
  title: string;         // Tên bài tập (VD: Lab 4 Redux Toolkit, Đồ án Cuối kỳ...)
  description?: string;  // Ghi chú / mô tả bài tập
  dueDate: string;       // ISO 8601 string (VD: "2026-09-25T23:59:00.000Z")
  priority: PriorityLevel;
  isCompleted: boolean;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------------------------
// UTILITY TYPES DEMONSTRATION (BUỔI 1)
// ----------------------------------------------------------------------

/** DTO tạo mới: Bỏ id, thời gian tạo/cập nhật và trạng thái hoàn thành (mặc định false) */
export type CreateAssignmentDTO = Omit<Assignment, 'id' | 'createdAt' | 'updatedAt' | 'isCompleted' | 'completedAt'>;

/** DTO cập nhật: Cho phép cập nhật từng phần (Partial), trừ id và createdAt */
export type UpdateAssignmentDTO = Partial<Omit<Assignment, 'id' | 'createdAt'>>;

/** DTO tóm tắt: Chỉ lấy các trường quan trọng (Pick) để hiển thị danh sách nhanh */
export type AssignmentSummary = Pick<Assignment, 'id' | 'subject' | 'title' | 'dueDate' | 'priority' | 'isCompleted'>;

/** Cấu hình hiển thị theo từng mức độ ưu tiên (Record) */
export interface PriorityMetadata {
  label: string;
  color: string;
  bg: string;
  border: string;
  badgeClass: string;
  weight: number; // 3: HIGH, 2: MEDIUM, 1: LOW
}

export type PriorityConfigMap = Record<PriorityLevel, PriorityMetadata>;

/** Bản sao chỉ đọc (Readonly) đảm bảo tính bất biến */
export type ReadonlyAssignment = Readonly<Assignment>;

/** Cấp độ khẩn cấp được tính toán từ thời gian deadline */
export type UrgencyTier = 'OVERDUE' | 'URGENT' | 'WARNING' | 'NORMAL' | 'COMPLETED';

export interface CountdownInfo {
  tier: UrgencyTier;
  label: string;            // "Còn 2 ngày 5 giờ" hoặc "Quá hạn 1 ngày"
  isOverdue: boolean;
  totalMilliseconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
