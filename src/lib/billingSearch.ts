import type { Bill } from "./types";
import { BillHashIndex } from "@/algorithms/hashMaps/billIndex";
import { binarySearch } from "@/algorithms/searching/binarySearch";
import { sortBillsById } from "@/services/algorithmBridge";

/**
 * Bill search: Hash Map O(1) for exact ID, Binary Search on sorted IDs, linear for item names.
 */
export function searchBills(bills: Bill[], query: string): Bill[] {
  const q = query.trim();
  if (!q) return bills;

  const index = new BillHashIndex(bills);
  const upper = q.toUpperCase();
  const exact = index.get(upper) ?? index.get(q);
  if (exact) return [exact];

  if (upper.startsWith("TRF-")) {
    const sorted = sortBillsById(bills);
    const idx = binarySearch(sorted, { id: upper } as Bill, (a, b) => a.id.localeCompare(b.id));
    if (idx >= 0) return [sorted[idx]];
  }

  const lower = q.toLowerCase();
  return bills.filter(
    (b) =>
      b.id.toLowerCase().includes(lower) ||
      b.items.some((i) => i.name.toLowerCase().includes(lower))
  );
}
