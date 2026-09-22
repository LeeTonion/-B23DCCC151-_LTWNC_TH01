/**
 * BUỔI 1: TYPESCRIPT NÂNG CAO - GENERIC UTILITIES
 * File: src/utils/genericFilters.ts
 * Minh họa Generic Functions, Type Constraints (extends), Key Constraints (keyof T)
 */

/** Generic Filter: Lọc mảng phần tử với bất kỳ predicate nào */
export function filterItems<T>(items: T[], predicate: (item: T) => boolean): T[] {
  return items.filter(predicate);
}

/** Generic Sort: Sắp xếp mảng theo bất kỳ thuộc tính nào của T với kiểm tra kiểu chặt chẽ */
export function sortItems<T, K extends keyof T>(
  items: T[],
  key: K,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];

    if (valA === valB) return 0;
    if (valA === undefined || valA === null) return 1;
    if (valB === undefined || valB === null) return -1;

    let comparison = 0;
    if (typeof valA === 'string' && typeof valB === 'string') {
      comparison = valA.localeCompare(valB, 'vi');
    } else if (valA > valB) {
      comparison = 1;
    } else {
      comparison = -1;
    }

    return order === 'asc' ? comparison : -comparison;
  });
}

/** Generic Search: Tìm kiếm trong mảng dựa trên nhiều trường văn bản */
export function searchByFields<T>(
  items: T[],
  searchQuery: string,
  fields: (keyof T)[]
): T[] {
  if (!searchQuery.trim()) return items;
  const normalizedQuery = searchQuery.toLowerCase().trim();

  return items.filter((item) => {
    return fields.some((field) => {
      const val = item[field];
      if (typeof val === 'string') {
        return val.toLowerCase().includes(normalizedQuery);
      }
      return false;
    });
  });
}

/** Generic Group By: Gom nhóm mảng theo 1 khóa cụ thể */
export function groupBy<T, K extends string | number | symbol>(
  items: T[],
  keySelector: (item: T) => K
): Record<K, T[]> {
  return items.reduce((acc, item) => {
    const key = keySelector(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}
