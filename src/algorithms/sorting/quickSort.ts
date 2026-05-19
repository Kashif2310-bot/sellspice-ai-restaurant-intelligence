/**
 * Quick Sort — average O(n log n), in-place partition sort.
 * Used as alternate ranking path for analytics benchmarks.
 */

export function quickSort<T>(arr: T[], compare: (a: T, b: T) => number): T[] {
  if (arr.length <= 1) return [...arr];
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter((x) => compare(x, pivot) < 0);
  const mid = arr.filter((x) => compare(x, pivot) === 0);
  const right = arr.filter((x) => compare(x, pivot) > 0);
  return [...quickSort(left, compare), ...mid, ...quickSort(right, compare)];
}

/** Time: O(n log n) avg, O(n²) worst | Space: O(log n) stack */
