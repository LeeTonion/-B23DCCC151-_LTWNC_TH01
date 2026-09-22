/**
 * BUỔI 2: REACT DESIGN PATTERNS - CUSTOM HOOKS NÂNG CAO
 * File: src/patterns/hooks/useDeadlineCountdown.ts
 * 
 * Tự động cập nhật thời gian đếm ngược "Còn X ngày" / "Quá hạn Y ngày" theo thời gian thực
 */

import { useState, useEffect } from 'react';
import type { CountdownInfo } from '../../types/assignment.types';
import { calculateDeadlineInfo } from '../../utils/dateUtils';

export function useDeadlineCountdown(
  dueDate: string,
  isCompleted: boolean = false
): CountdownInfo {
  const [countdown, setCountdown] = useState<CountdownInfo>(() =>
    calculateDeadlineInfo(dueDate, isCompleted)
  );

  useEffect(() => {
    // Tính ngay lập tức khi props thay đổi
    setCountdown(calculateDeadlineInfo(dueDate, isCompleted));

    if (isCompleted) return;

    // Nếu bài tập gần kề (<24h) hoặc đang quá hạn, đếm mỗi 10 giây; nếu xa hơn đếm mỗi 60 giây
    const checkInterval = countdown.tier === 'URGENT' || countdown.tier === 'OVERDUE' ? 10000 : 60000;

    const timerId = setInterval(() => {
      setCountdown(calculateDeadlineInfo(dueDate, isCompleted));
    }, checkInterval);

    return () => clearInterval(timerId);
  }, [dueDate, isCompleted, countdown.tier]);

  return countdown;
}
