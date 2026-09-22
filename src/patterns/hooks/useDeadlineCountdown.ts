

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
    
    setCountdown(calculateDeadlineInfo(dueDate, isCompleted));

    if (isCompleted) return;

    const checkInterval = countdown.tier === 'URGENT' || countdown.tier === 'OVERDUE' ? 10000 : 60000;

    const timerId = setInterval(() => {
      setCountdown(calculateDeadlineInfo(dueDate, isCompleted));
    }, checkInterval);

    return () => clearInterval(timerId);
  }, [dueDate, isCompleted, countdown.tier]);

  return countdown;
}
