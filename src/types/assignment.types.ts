

export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type StatusFilter = 'ALL' | 'PENDING' | 'OVERDUE' | 'COMPLETED';

export type SortField = 'dueDate' | 'priority' | 'title' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface Assignment {
  id: string;
  subject: string;       
  title: string;         
  description?: string;  
  dueDate: string;       
  priority: PriorityLevel;
  isCompleted: boolean;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateAssignmentDTO = Omit<Assignment, 'id' | 'createdAt' | 'updatedAt' | 'isCompleted' | 'completedAt'>;

export type UpdateAssignmentDTO = Partial<Omit<Assignment, 'id' | 'createdAt'>>;

export type AssignmentSummary = Pick<Assignment, 'id' | 'subject' | 'title' | 'dueDate' | 'priority' | 'isCompleted'>;

export interface PriorityMetadata {
  label: string;
  color: string;
  bg: string;
  border: string;
  badgeClass: string;
  weight: number; 
}

export type PriorityConfigMap = Record<PriorityLevel, PriorityMetadata>;

export type ReadonlyAssignment = Readonly<Assignment>;

export type UrgencyTier = 'OVERDUE' | 'URGENT' | 'WARNING' | 'NORMAL' | 'COMPLETED';

export interface CountdownInfo {
  tier: UrgencyTier;
  label: string;            
  isOverdue: boolean;
  totalMilliseconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
