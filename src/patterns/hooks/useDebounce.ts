/**
 * BUỔI 2: REACT DESIGN PATTERNS - CUSTOM HOOKS
 * File: src/patterns/hooks/useDebounce.ts
 * Minh họa Generic Debounce Hook
 */

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
