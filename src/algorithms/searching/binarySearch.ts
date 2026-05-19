/**
 * Binary Search — O(log n) lookup on sorted arrays.
 * Business: Fast bill ID lookup in sorted transaction ledger.
 */

export function binarySearch<T>(
  sorted: T[],
  target: T,
  compare: (a: T, b: T) => number
): number {
  let lo = 0;
  let hi = sorted.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const c = compare(sorted[mid], target);
    if (c === 0) return mid;
    if (c < 0) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

export function binarySearchByKey<T>(
  sorted: T[],
  key: string,
  keyOf: (item: T) => string
): number {
  return binarySearch(sorted, key as unknown as T, (a, b) =>
    keyOf(a).localeCompare(keyOf(b as unknown as T))
  );
}

/** Time: O(log n) | Space: O(1) */
