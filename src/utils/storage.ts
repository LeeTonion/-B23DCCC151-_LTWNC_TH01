/**
 * Generic Type-Safe LocalStorage Manager
 * File: src/utils/storage.ts
 */

export class LocalStorageManager<T> {
  constructor(private readonly key: string, private readonly fallback: T) {}

  get(): T {
    try {
      const item = localStorage.getItem(this.key);
      if (item === null) return this.fallback;
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`[LocalStorageManager] Không thể đọc key "${this.key}":`, error);
      return this.fallback;
    }
  }

  set(value: T): boolean {
    try {
      localStorage.setItem(this.key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[LocalStorageManager] Không thể ghi key "${this.key}":`, error);
      return false;
    }
  }

  remove(): void {
    try {
      localStorage.removeItem(this.key);
    } catch (error) {
      console.error(`[LocalStorageManager] Không thể xóa key "${this.key}":`, error);
    }
  }
}
