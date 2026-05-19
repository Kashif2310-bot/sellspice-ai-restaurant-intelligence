import type { ItemSalesStats } from "@/lib/types";
import { mergeSort } from "./mergeSort";

/**
 * Ranks menu items by revenue (descending) using Merge Sort.
 * Business: Dashboard "Top movers" and billing leaderboards.
 */

export function rankTopSellingItems(
  stats: ItemSalesStats[],
  limit = 12,
  by: "revenue" | "sold" = "revenue"
): ItemSalesStats[] {
  const sorted = mergeSort(stats, (a, b) =>
    by === "revenue" ? b.revenue - a.revenue : b.sold - a.sold
  );
  return sorted.slice(0, limit);
}

/** Time: O(n log n) | Space: O(n) */
