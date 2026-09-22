/**
 * Tiện ích xử lý Ngày giờ & Tính toán Deadline
 * File: src/utils/dateUtils.ts
 */

import type { CountdownInfo, PriorityConfigMap, UrgencyTier } from '../types/assignment.types';

export const PRIORITY_CONFIG: PriorityConfigMap = {
  HIGH: {
    label: 'Cao',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.3)',
    badgeClass: 'priority-high',
    weight: 3,
  },
  MEDIUM: {
    label: 'Trung bình',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.3)',
    badgeClass: 'priority-medium',
    weight: 2,
  },
  LOW: {
    label: 'Thấp',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.3)',
    badgeClass: 'priority-low',
    weight: 1,
  },
};

/**
 * Tính toán thời gian còn lại hoặc quá hạn của một deadline
 * Trả về thông tin chi tiết: "Còn X ngày Y giờ", "Quá hạn Z ngày" và mức độ khẩn cấp (tier)
 */
export function calculateDeadlineInfo(
  dueDateString: string,
  isCompleted: boolean = false,
  now: Date = new Date()
): CountdownInfo {
  if (isCompleted) {
    return {
      tier: 'COMPLETED',
      label: 'Đã hoàn thành',
      isOverdue: false,
      totalMilliseconds: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const dueTime = new Date(dueDateString).getTime();
  const currentTime = now.getTime();
  const diffMs = dueTime - currentTime;

  const isPast = diffMs < 0;
  const absDiff = Math.abs(diffMs);

  const totalMinutes = Math.floor(absDiff / (1000 * 60));
  const totalHours = Math.floor(absDiff / (1000 * 60 * 60));
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

  let tier: UrgencyTier;
  let label: string;

  if (isPast) {
    tier = 'OVERDUE';
    if (days === 0) {
      if (hours === 0) {
        label = `Quá hạn ${totalMinutes} phút`;
      } else {
        label = `Quá hạn ${hours} giờ ${minutes}p`;
      }
    } else {
      label = `Quá hạn ${days} ngày ${hours > 0 ? `${hours}h` : ''}`;
    }
  } else {
    // Sắp đến hạn
    if (totalHours < 24) {
      tier = 'URGENT';
      if (totalHours === 0) {
        label = `Còn ${minutes} phút`;
      } else {
        label = `Còn ${totalHours} giờ ${minutes}p`;
      }
    } else if (days <= 3) {
      tier = 'WARNING';
      label = `Còn ${days} ngày ${hours} giờ`;
    } else {
      tier = 'NORMAL';
      label = `Còn ${days} ngày`;
    }
  }

  return {
    tier,
    label,
    isOverdue: isPast,
    totalMilliseconds: diffMs,
    days,
    hours,
    minutes,
    seconds,
  };
}

/** Định dạng ngày hiển thị theo chuẩn Việt Nam (VD: 23:59 Thứ Sáu, 26/09/2026) */
export function formatFullDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const timeStr = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const dateStr = date.toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    return `${timeStr} • ${dateStr}`;
  } catch {
    return isoString;
  }
}

/** Chuyển đổi Date sang định dạng ISO cục bộ cho input datetime-local */
export function toLocalDatetimeInputString(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}
