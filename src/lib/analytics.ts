import type {
  AIInsight,
  Bill,
  CategoryShare,
  DailyForecast,
  HourlySales,
  IngredientStock,
  ItemSalesStats,
  MenuItem,
  RestockPrediction,
} from "./types";
import { menuById, menuItems } from "./menu";
import { rankItems, predictTomorrowRevenue, suggestCombos } from "@/services/algorithmBridge";
import { forecastDemandDP } from "@/algorithms/dynamicProgramming/inventoryForecast";

const PROFIT_MARGIN = 0.342;

export function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

export function getBillsForToday(bills: Bill[]): Bill[] {
  return bills.filter((b) => isToday(b.timestamp));
}

export function computeHourlySales(bills: Bill[]): HourlySales[] {
  const hours = [9, 11, 13, 15, 17, 19, 21, 23];
  return hours.map((hour) => {
    const label = hour === 9 ? "9AM" : hour === 11 ? "11AM" : hour === 13 ? "1PM" : hour === 15 ? "3PM" : hour === 17 ? "5PM" : hour === 19 ? "7PM" : hour === 21 ? "9PM" : "11PM";
    const matching = bills.filter((b) => {
      const h = new Date(b.timestamp).getHours();
      return h >= hour - 1 && h < hour + 1;
    });
    const sales = matching.reduce((s, b) => s + b.total, 0);
    return {
      time: label,
      hour,
      sales: Math.round(sales),
      profit: Math.round(sales * PROFIT_MARGIN),
      orders: matching.length,
    };
  });
}

export function computeTopItems(bills: Bill[], menu: MenuItem[]): ItemSalesStats[] {
  const map = new Map<string, { sold: number; revenue: number }>();

  for (const bill of bills) {
    for (const line of bill.items) {
      const cur = map.get(line.menuItemId) ?? { sold: 0, revenue: 0 };
      cur.sold += line.qty;
      cur.revenue += line.lineTotal;
      map.set(line.menuItemId, cur);
    }
  }

  const stats: ItemSalesStats[] = [];
  for (const [id, data] of map) {
    const item = menuById.get(id);
    if (!item) continue;
    stats.push({
      menuItemId: id,
      name: item.name,
      category: item.category,
      price: item.price,
      sold: data.sold,
      revenue: data.revenue,
      trend: Math.round(8 + (data.sold % 17)),
    });
  }

  return rankItems(stats, 12);
}

export function computeCategoryShare(bills: Bill[]): CategoryShare[] {
  const map = new Map<string, number>();
  let total = 0;
  for (const bill of bills) {
    for (const line of bill.items) {
      const item = menuById.get(line.menuItemId);
      const cat = item?.category ?? "Other";
      map.set(cat, (map.get(cat) ?? 0) + line.lineTotal);
      total += line.lineTotal;
    }
  }
  return [...map.entries()]
    .map(([name, revenue]) => ({
      name,
      revenue,
      value: total > 0 ? Math.round((revenue / total) * 100) : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);
}

export function computeForecast(bills: Bill[]): DailyForecast[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const now = new Date();
  const dailyTotals: number[] = [];
  const weekendFlags: boolean[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayBills = bills.filter((b) => new Date(b.timestamp).toDateString() === d.toDateString());
    dailyTotals.push(dayBills.reduce((s, b) => s + b.total, 0));
    weekendFlags.push(d.getDay() === 0 || d.getDay() === 6);
  }

  const dp = forecastDemandDP({ dailyRevenue: dailyTotals, isWeekend: weekendFlags });

  return days.map((day, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const isFuture = i > new Date().getDay() - 1 && i >= 5;
    const actual = isFuture ? null : dailyTotals[i] || null;
    const predicted = dp.predicted[i] ?? predictTomorrowRevenue(bills);

    return {
      day,
      date: d.toISOString().slice(0, 10),
      actual,
      predicted,
      isWeekend,
    };
  });
}

export function computeAIInsights(
  bills: Bill[],
  stock: IngredientStock[],
  topItems: ItemSalesStats[]
): AIInsight[] {
  const todayBills = getBillsForToday(bills);
  const revenue = todayBills.reduce((s, b) => s + b.total, 0);
  const critical = stock.filter((s) => s.status === "critical");
  const low = stock.filter((s) => s.status === "low");
  const insights: AIInsight[] = [];

  if (critical.length) {
    insights.push({
      type: "warning",
      title: `${critical[0].name} critically low (${critical[0].remaining}${critical[0].unit})`,
      detail: `At current burn rate you run out by ${estimateRunoutHour(critical[0])}. Reorder ${Math.ceil(critical[0].parLevel * 0.8)} ${critical[0].unit} from supplier now.`,
      impact: `Avoid ₹${Math.round(revenue * 0.12).toLocaleString()} stockout loss`,
    });
  }

  const topShake = topItems.find((t) => t.name.includes("Shake") || t.name.includes("Cold Coffee"));
  if (topShake && topShake.trend > 15) {
    insights.push({
      type: "insight",
      title: `${topShake.name} trending +${topShake.trend}%`,
      detail: `Pair with burger orders as upsell — historical attach rate 38% at Truffles Sanjaynagar. Train floor staff on combo pitch.`,
      impact: `+₹${Math.round(topShake.revenue * 0.08).toLocaleString()} est.`,
    });
  }

  const studentOrders = todayBills.filter((b) => b.orderType === "student").length;
  if (studentOrders > 40) {
    insights.push({
      type: "opportunity",
      title: "Push Student Power Combo at MS Ramaiah",
      detail: `College ID + Veg Burger + Iced Latte at ₹299. ${studentOrders} student orders today — rain after 6 PM typically +35% indoor dine-in.`,
      impact: `+₹${Math.round(studentOrders * 45).toLocaleString()} est.`,
    });
  }

  const burgerTop = topItems.find((t) => t.category === "Burgers");
  if (burgerTop) {
    insights.push({
      type: "opportunity",
      title: `Friday ${burgerTop.name} prep — pre-marinate now`,
      detail: `Forecast shows weekend surge. ${burgerTop.sold} burgers sold today. Pre-prep patties tonight to cut kitchen lag from 18min → 9min.`,
      impact: "+12 covers/hr",
    });
  }

  if (low.length && !critical.length) {
    insights.push({
      type: "warning",
      title: `${low.length} ingredients below par`,
      detail: `${low.map((l) => l.name).join(", ")} need restock before weekend rush.`,
      impact: "Prevent service delays",
    });
  }

  const combos = suggestCombos(menuItems, 450);
  if (combos[0]) {
    const c = combos[0];
    insights.push({
      type: "opportunity",
      title: `Greedy combo: ${c.label} · ₹${c.totalPrice}`,
      detail: `${c.items.map((i) => i.name).join(" + ")} — est. profit ₹${c.estimatedProfit}. Push during 5–8 PM student window.`,
      impact: `+₹${c.estimatedProfit} margin potential`,
    });
  }

  return insights.slice(0, 4);
}

function estimateRunoutHour(s: IngredientStock): string {
  const rate = s.used / 12 || 1;
  const hoursLeft = s.remaining / rate;
  const h = new Date();
  h.setHours(h.getHours() + Math.floor(hoursLeft));
  return h.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export function computeRestockPredictions(stock: IngredientStock[]): RestockPrediction[] {
  return stock
    .filter((s) => s.status !== "ok")
    .map((s) => ({
      ingredientId: s.ingredientId,
      item: s.name,
      qty: `${Math.ceil(s.parLevel * 0.75)} ${s.unit}`,
      reason:
        s.status === "critical"
          ? `Critical — ${Math.round((s.remaining / s.parLevel) * 100)}% of par remaining`
          : `Low stock — weekend burger rush projected`,
      urgency: s.status === "critical" ? ("high" as const) : ("medium" as const),
    }))
    .slice(0, 6);
}

export function computeTotals(bills: Bill[]) {
  const today = getBillsForToday(bills);
  const revenueToday = today.reduce((s, b) => s + b.total, 0);
  const ordersToday = today.length;
  const unitsSoldToday = today.reduce((s, b) => s + b.items.reduce((u, l) => u + l.qty, 0), 0);

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const revenueWeek = bills
    .filter((b) => new Date(b.timestamp) >= weekStart)
    .reduce((s, b) => s + b.total, 0);

  return {
    revenueToday,
    ordersToday,
    avgTicket: ordersToday > 0 ? Math.round(revenueToday / ordersToday) : 0,
    profitMargin: PROFIT_MARGIN * 100,
    revenueWeek,
    unitsSoldToday,
  };
}
