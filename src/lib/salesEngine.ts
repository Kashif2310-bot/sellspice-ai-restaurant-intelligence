import type { Bill, BillLineItem, MenuItem, PaymentMethod, OrderSource, OrderType } from "./types";
import { menuItems, GST_RATE, PACKAGING_CHARGE } from "./menu";
// menuItems used for OCR id lookup in createBillFromOcrItems

/** Seeded PRNG for reproducible simulation */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PAYMENTS: PaymentMethod[] = ["upi", "upi", "upi", "card", "cash", "swiggy", "zomato"];
const SOURCES: OrderSource[] = ["dine-in", "dine-in", "dine-in", "takeaway", "delivery"];
const ORDER_TYPES: OrderType[] = ["individual", "individual", "group", "student"];

/** Hourly order weight — Truffles Sanjaynagar pattern (student + office lunch + dinner rush) */
const HOURLY_WEIGHTS: Record<number, number> = {
  9: 0.3, 10: 0.5, 11: 0.9, 12: 1.4, 13: 2.2, 14: 1.8, 15: 0.9, 16: 0.7,
  17: 1.0, 18: 1.6, 19: 2.4, 20: 2.6, 21: 2.2, 22: 1.4, 23: 0.6,
};

/** Item popularity weights from real Truffles-style demand */
function buildItemWeights(): Map<string, number> {
  const weights = new Map<string, number>();
  for (const item of menuItems) {
    let w = 1;
    if (item.tags.includes("bestseller")) w *= 3.2;
    if (item.tags.includes("student-fav")) w *= 2.4;
    if (item.tags.includes("signature")) w *= 2;
    if (item.tags.includes("value")) w *= 1.8;
    if (item.tags.includes("premium")) w *= 0.35;
    if (item.category === "Burgers") w *= 1.6;
    if (item.category === "Beverages") w *= 1.9;
    if (item.category === "Fries") w *= 1.5;
    if (item.category === "Desserts") w *= 1.1;
    if (item.category === "Combos") w *= 1.3;
    if (item.price > 350) w *= 0.4;
    weights.set(item.id, w);
  }
  return weights;
}

const ITEM_WEIGHTS = buildItemWeights();

function pickWeighted<T extends { id: string }>(items: T[], weights: Map<string, number>, rand: () => number): T {
  let total = 0;
  for (const item of items) total += weights.get(item.id) ?? 1;
  let r = rand() * total;
  for (const item of items) {
    r -= weights.get(item.id) ?? 1;
    if (r <= 0) return item;
  }
  return items[items.length - 1];
}

function generateBillId(date: Date, seq: number): string {
  const d = date.toISOString().slice(0, 10).replace(/-/g, "");
  return `TRF-${d}-${String(seq).padStart(4, "0")}`;
}

function createBill(
  date: Date,
  seq: number,
  lineItems: BillLineItem[],
  payment: PaymentMethod,
  source: OrderSource,
  orderType: OrderType,
  packaging: boolean
): Bill {
  const subtotal = lineItems.reduce((s, l) => s + l.lineTotal, 0);
  const gstAmount = Math.round(subtotal * GST_RATE * 100) / 100;
  const packagingCharge = packaging && source !== "dine-in" ? PACKAGING_CHARGE : 0;
  const total = Math.round((subtotal + gstAmount + packagingCharge) * 100) / 100;

  return {
    id: generateBillId(date, seq),
    timestamp: date.toISOString(),
    items: lineItems,
    subtotal,
    gstRate: GST_RATE,
    gstAmount,
    packagingCharge,
    total,
    paymentMethod: payment,
    source,
    orderType,
    tableNumber: source === "dine-in" ? `T${Math.floor(Math.random() * 18) + 1}` : undefined,
  };
}

function generateLineItems(
  count: number,
  rand: () => number,
  hour: number,
  isWeekend: boolean
): BillLineItem[] {
  const lines: BillLineItem[] = [];
  const pool = menuItems.filter((m) => !m.isCombo || rand() > 0.7);

  for (let i = 0; i < count; i++) {
    const item = pickWeighted(pool, ITEM_WEIGHTS, rand);
    let qty = 1;
    if (rand() < 0.15 && item.category !== "Beverages") qty = 2;
    if (isWeekend && item.category === "Desserts" && rand() < 0.2) qty = 2;

    // Student evening: more shakes & fries
    if (hour >= 17 && hour <= 22 && item.tags.includes("student-fav") && rand() < 0.3) qty = 2;

    const unitPrice = item.price;
    lines.push({
      menuItemId: item.id,
      name: item.name,
      qty,
      unitPrice,
      lineTotal: unitPrice * qty,
    });
  }
  return lines;
}

export interface SalesEngineOptions {
  daysBack?: number;
  seed?: number;
}

export function generateHistoricalBills(options: SalesEngineOptions = {}): Bill[] {
  const { daysBack = 14, seed = 42 } = options;
  const rand = mulberry32(seed);
  const bills: Bill[] = [];
  const now = new Date();
  let seq = 1;

  for (let d = daysBack; d >= 0; d--) {
    const day = new Date(now);
    day.setDate(day.getDate() - d);
    day.setHours(0, 0, 0, 0);

    const dow = day.getDay();
    const isWeekend = dow === 0 || dow === 6;
    const isFriday = dow === 5;

    // Base orders: weekday ~280-340, weekend ~420-520, Friday boost
    let baseOrders = isWeekend ? 480 + Math.floor(rand() * 60) : 300 + Math.floor(rand() * 50);
    if (isFriday) baseOrders = Math.floor(baseOrders * 1.15);

    // Seasonal: mango season (Apr-Jun) boosts mango items
    const month = day.getMonth();
    if (month >= 3 && month <= 5) baseOrders = Math.floor(baseOrders * 1.05);

    for (let order = 0; order < baseOrders; order++) {
      const hourRoll = rand();
      let hour = 12;
      let cum = 0;
      const hours = Object.keys(HOURLY_WEIGHTS).map(Number);
      const totalW = hours.reduce((s, h) => s + HOURLY_WEIGHTS[h], 0);
      for (const h of hours) {
        cum += HOURLY_WEIGHTS[h] / totalW;
        if (hourRoll <= cum) { hour = h; break; }
      }

      const minute = Math.floor(rand() * 60);
      const billDate = new Date(day);
      billDate.setHours(hour, minute, Math.floor(rand() * 60));

      const itemCount = rand() < 0.35 ? 1 : rand() < 0.7 ? 2 : rand() < 0.9 ? 3 : 4;
      const lines = generateLineItems(itemCount, rand, hour, isWeekend);

      let payment = PAYMENTS[Math.floor(rand() * PAYMENTS.length)];
      let source = SOURCES[Math.floor(rand() * SOURCES.length)];
      let orderType = ORDER_TYPES[Math.floor(rand() * ORDER_TYPES.length)];

      // Student crowd 5-10 PM near MS Ramaiah
      if (hour >= 17 && hour <= 22 && rand() < 0.42) {
        orderType = "student";
        if (rand() < 0.6) payment = "upi";
      }

      // Delivery apps peak dinner
      if (hour >= 19 && hour <= 21 && rand() < 0.25) {
        source = "delivery";
        payment = rand() < 0.5 ? "swiggy" : "zomato";
      }

      const packaging = source !== "dine-in";
      bills.push(createBill(billDate, seq++, lines, payment, source, orderType, packaging));
    }
  }

  return bills.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function createBillFromOcrItems(
  parsed: {
    name: string;
    qty: number;
    price: number;
    menuItemId?: string | null;
    resolvedName?: string;
  }[],
  menuLookup: (name: string) => MenuItem | undefined
): Bill {
  const lines: BillLineItem[] = parsed.map((p) => {
    const match =
      (p.menuItemId ? menuItems.find((m) => m.id === p.menuItemId) : undefined) ??
      menuLookup(p.name);
    const displayName = p.resolvedName ?? match?.name ?? p.name;
    const unitPrice = p.price > 0 ? p.price : match?.price ?? 0;
    return {
      menuItemId: match?.id ?? `ocr-${displayName.toLowerCase().replace(/\s+/g, "-")}`,
      name: displayName,
      qty: p.qty,
      unitPrice,
      lineTotal: unitPrice * p.qty,
    };
  });

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const gstAmount = Math.round(subtotal * GST_RATE * 100) / 100;

  return {
    id: generateBillId(new Date(), Math.floor(Math.random() * 9999)),
    timestamp: new Date().toISOString(),
    items: lines,
    subtotal,
    gstRate: GST_RATE,
    gstAmount,
    packagingCharge: PACKAGING_CHARGE,
    total: subtotal + gstAmount + PACKAGING_CHARGE,
    paymentMethod: "upi",
    source: "dine-in",
    orderType: "individual",
    fromOcr: true,
  };
}
