import type { Bill, IngredientStock, RestaurantSnapshot, RestaurantState } from "./types";
import { menuItems, restaurantInfo, findMenuItem } from "./menu";
import { createInitialStock, getRecipe, computeStockStatus } from "./inventory";
import { generateHistoricalBills, createBillFromOcrItems } from "./salesEngine";
import {
  computeHourlySales,
  computeTopItems,
  computeCategoryShare,
  computeForecast,
  computeAIInsights,
  computeRestockPredictions,
  computeTotals,
  getBillsForToday,
} from "./analytics";

const STORAGE_KEY = "sellspice:restaurant:v2";

function deductInventory(stock: IngredientStock[], bill: Bill): IngredientStock[] {
  const stockMap = new Map(stock.map((s) => [s.ingredientId, { ...s }]));

  for (const line of bill.items) {
    const menuItem = menuItems.find((m) => m.id === line.menuItemId);
    const recipe = getRecipe(line.menuItemId, menuItem?.category ?? "Other");

    for (const r of recipe) {
      const ing = stockMap.get(r.ingredientId);
      if (!ing) continue;
      const used = r.qty * line.qty;
      ing.used = Math.round((ing.used + used) * 100) / 100;
      ing.remaining = Math.round((ing.remaining - used) * 100) / 100;
      ing.status = computeStockStatus(ing.remaining, ing.parLevel);
      stockMap.set(r.ingredientId, ing);
    }
  }

  return [...stockMap.values()];
}

function applyHistoricalUsage(stock: IngredientStock[], bills: Bill[]): IngredientStock[] {
  let current = stock.map((s) => ({ ...s, used: 0, remaining: s.initial }));
  const historical = bills.filter((b) => !isTodayBill(b));
  for (const bill of historical) {
    current = deductInventory(current, bill);
  }
  return current;
}

function isTodayBill(bill: Bill): boolean {
  return new Date(bill.timestamp).toDateString() === new Date().toDateString();
}

export function loadState(): RestaurantState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as RestaurantState;
      if (parsed.bills?.length) return parsed;
    }
  } catch { /* regenerate */ }

  const bills = generateHistoricalBills({ daysBack: 14, seed: 42 });
  const stock = applyHistoricalUsage(createInitialStock(), bills);

  return {
    bills,
    stock,
    initializedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  };
}

export function saveState(state: RestaurantState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* quota */ }
}

export function addBill(state: RestaurantState, bill: Bill): RestaurantState {
  const bills = [bill, ...state.bills];
  const stock = deductInventory(state.stock, bill);
  return { bills, stock, initializedAt: state.initializedAt, lastUpdated: new Date().toISOString() };
}

export function addBillFromOcr(
  state: RestaurantState,
  parsed: {
    name: string;
    qty: number;
    price: number;
    menuItemId?: string | null;
    resolvedName?: string;
  }[]
): { state: RestaurantState; bill: Bill } {
  const bill = createBillFromOcrItems(parsed, findMenuItem);
  return { state: addBill(state, bill), bill };
}

export function buildSnapshot(state: RestaurantState): RestaurantSnapshot {
  const todayBills = getBillsForToday(state.bills);
  const topItems = computeTopItems(todayBills.length ? todayBills : state.bills.slice(0, 200), menuItems);

  return {
    restaurant: restaurantInfo,
    bills: state.bills,
    menu: menuItems,
    stock: state.stock,
    hourlySales: computeHourlySales(todayBills.length ? todayBills : state.bills.slice(0, 150)),
    topItems,
    categoryShare: computeCategoryShare(todayBills.length ? todayBills : state.bills.slice(0, 200)),
    forecast: computeForecast(state.bills),
    aiInsights: computeAIInsights(state.bills, state.stock, topItems),
    restockPredictions: computeRestockPredictions(state.stock),
    totals: computeTotals(state.bills),
  };
}

export function getLiveContextForAI(snapshot: RestaurantSnapshot): Record<string, unknown> {
  return {
    restaurant: snapshot.restaurant,
    totals: snapshot.totals,
    topItems: snapshot.topItems.slice(0, 8).map((t) => ({
      name: t.name,
      sold: t.sold,
      revenue: t.revenue,
      price: t.price,
    })),
    criticalStock: snapshot.stock
      .filter((s) => s.status !== "ok")
      .map((s) => ({ name: s.name, remaining: s.remaining, unit: s.unit, status: s.status })),
    recentBills: snapshot.bills.slice(0, 5).map((b) => ({
      id: b.id,
      total: b.total,
      items: b.items.length,
      source: b.source,
    })),
    categoryShare: snapshot.categoryShare,
    ordersToday: snapshot.totals.ordersToday,
    revenueToday: snapshot.totals.revenueToday,
  };
}
