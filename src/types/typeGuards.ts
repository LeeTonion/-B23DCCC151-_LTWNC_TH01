/**
 * BUỔI 1: TYPESCRIPT NÂNG CAO - TYPE GUARDS
 * File: src/types/typeGuards.ts
 * Minh họa Type Predicates (is), kiểm tra kiểu lúc Runtime an toàn
 */

import type { Assignment, PriorityLevel } from './assignment.types';

/** Type Guard kiểm tra xem 1 giá trị bất kỳ có phải là PriorityLevel hợp lệ không */
export function isPriorityLevel(val: unknown): val is PriorityLevel {
  return typeof val === 'string' && ['HIGH', 'MEDIUM', 'LOW'].includes(val);
}

/** Type Guard kiểm tra xem 1 object có đầy đủ cấu trúc của Assignment không */
export function isAssignment(obj: unknown): obj is Assignment {
  if (typeof obj !== 'object' || obj === null) return false;
  
  const candidate = obj as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.subject === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.dueDate === 'string' &&
    isPriorityLevel(candidate.priority) &&
    typeof candidate.isCompleted === 'boolean' &&
    typeof candidate.createdAt === 'string'
  );
}

/** Type Guard / Domain Guard: Kiểm tra bài tập đã quá hạn chưa (chưa hoàn thành + ngày đến hạn < hiện tại) */
export function isOverdue(assignment: Assignment, now: Date = new Date()): boolean {
  if (assignment.isCompleted) return false;
  const due = new Date(assignment.dueDate).getTime();
  return due < now.getTime();
}

/** Domain Guard: Kiểm tra bài tập sắp đến hạn trong vòng N giờ (mặc định 24h) */
export function isDueSoon(assignment: Assignment, hoursThreshold: number = 24, now: Date = new Date()): boolean {
  if (assignment.isCompleted) return false;
  const due = new Date(assignment.dueDate).getTime();
  const current = now.getTime();
  const diffHours = (due - current) / (1000 * 60 * 60);
  return diffHours >= 0 && diffHours <= hoursThreshold;
}
