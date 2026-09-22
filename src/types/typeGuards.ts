

import type { Assignment, PriorityLevel } from './assignment.types';

export function isPriorityLevel(val: unknown): val is PriorityLevel {
  return typeof val === 'string' && ['HIGH', 'MEDIUM', 'LOW'].includes(val);
}

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

export function isOverdue(assignment: Assignment, now: Date = new Date()): boolean {
  if (assignment.isCompleted) return false;
  const due = new Date(assignment.dueDate).getTime();
  return due < now.getTime();
}

export function isDueSoon(assignment: Assignment, hoursThreshold: number = 24, now: Date = new Date()): boolean {
  if (assignment.isCompleted) return false;
  const due = new Date(assignment.dueDate).getTime();
  const current = now.getTime();
  const diffHours = (due - current) / (1000 * 60 * 60);
  return diffHours >= 0 && diffHours <= hoursThreshold;
}
