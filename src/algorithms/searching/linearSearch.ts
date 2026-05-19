/**
 * Linear search with early exit — used when dataset is unsorted or small.
 */

export function linearSearch<T>(
  items: T[],
  predicate: (item: T) => boolean
): T | undefined {
  for (const item of items) {
    if (predicate(item)) return item;
  }
  return undefined;
}

/** Time: O(n) | Space: O(1) */
