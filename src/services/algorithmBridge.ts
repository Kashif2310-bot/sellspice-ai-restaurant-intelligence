/**
 * Bridges DAA algorithm modules to business layers without UI changes.
 */
import type { Bill, ItemSalesStats, MenuItem } from "@/lib/types";
import {
  rankTopSellingItems,
  forecastDemandDP,
  greedyComboRecommendations,
  BillHashIndex,
  MenuHashIndex,
  simulateTrufflesDeliveryRoute,
  quickSort,
} from "@/algorithms";

let menuIndex: MenuHashIndex | null = null;

export function getMenuIndex(menu: MenuItem[]): MenuHashIndex {
  if (!menuIndex || menuIndex.size() !== menu.length) {
    menuIndex = new MenuHashIndex(menu);
  }
  return menuIndex;
}

export function rankItems(stats: ItemSalesStats[], limit = 12): ItemSalesStats[] {
  return rankTopSellingItems(stats, limit, "revenue");
}

export function predictTomorrowRevenue(bills: Bill[]): number {
  const now = new Date();
  const daily: number[] = [];
  const weekend: boolean[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayBills = bills.filter(
      (b) => new Date(b.timestamp).toDateString() === d.toDateString()
    );
    daily.push(dayBills.reduce((s, b) => s + b.total, 0));
    weekend.push(d.getDay() === 0 || d.getDay() === 6);
  }

  return forecastDemandDP({ dailyRevenue: daily, isWeekend: weekend }).tomorrow;
}

export function suggestCombos(menu: MenuItem[], budget = 450) {
  return greedyComboRecommendations(menu, budget);
}

export function indexBills(bills: Bill[]): BillHashIndex {
  return new BillHashIndex(bills);
}

export function sortBillsById(bills: Bill[]): Bill[] {
  return quickSort(bills, (a, b) => a.id.localeCompare(b.id));
}

export function getDeliveryRouteDemo() {
  return simulateTrufflesDeliveryRoute();
}
