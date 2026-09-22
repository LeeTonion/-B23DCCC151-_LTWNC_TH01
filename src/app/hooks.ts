/**
 * BUỔI 3: REDUX TOOLKIT + TYPESCRIPT
 * File: src/app/hooks.ts
 * Typed Redux Hooks thay thế useDispatch & useSelector thông thường
 */

import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

// Sử dụng trong toàn bộ components thay vì useDispatch và useSelector thuần
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
