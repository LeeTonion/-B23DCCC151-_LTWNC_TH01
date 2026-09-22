/**
 * BUỔI 3: REDUX TOOLKIT + TYPESCRIPT
 * File: src/app/store.ts
 * Cấu hình Store tập trung với Type Definitions
 */

import { configureStore } from '@reduxjs/toolkit';
import assignmentsReducer from '../features/assignments/assignmentsSlice';

export const store = configureStore({
  reducer: {
    assignments: assignmentsReducer,
  },
  devTools: import.meta.env.DEV,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
