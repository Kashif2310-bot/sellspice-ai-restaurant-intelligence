export type DietaryType = "veg" | "non-veg";
export type PaymentMethod = "upi" | "card" | "cash" | "swiggy" | "zomato";
export type OrderSource = "dine-in" | "takeaway" | "delivery";
export type OrderType = "individual" | "group" | "student";
export type StockStatus = "ok" | "low" | "critical";

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  dietary: DietaryType;
  tags: string[];
  isCombo?: boolean;
  comboItems?: string[];
}

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  parLevel: number;
  costPerUnit: number;
}

export interface RecipeLine {
  ingredientId: string;
  qty: number;
}

export interface BillLineItem {
  menuItemId: string;
  name: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Bill {
  id: string;
  timestamp: string;
  items: BillLineItem[];
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  packagingCharge: number;
  total: number;
  paymentMethod: PaymentMethod;
  source: OrderSource;
  orderType: OrderType;
  tableNumber?: string;
  customerNote?: string;
  fromOcr?: boolean;
}

export interface IngredientStock {
  ingredientId: string;
  name: string;
  unit: string;
  initial: number;
  used: number;
  remaining: number;
  parLevel: number;
  status: StockStatus;
}

export interface ItemSalesStats {
  menuItemId: string;
  name: string;
  category: string;
  price: number;
  sold: number;
  revenue: number;
  trend: number;
}

export interface HourlySales {
  time: string;
  hour: number;
  sales: number;
  profit: number;
  orders: number;
}

export interface CategoryShare {
  name: string;
  value: number;
  revenue: number;
}

export interface DailyForecast {
  day: string;
  date: string;
  actual: number | null;
  predicted: number;
  isWeekend: boolean;
}

export interface AIInsight {
  type: "opportunity" | "warning" | "insight";
  title: string;
  detail: string;
  impact: string;
}

export interface RestockPrediction {
  ingredientId: string;
  item: string;
  qty: string;
  reason: string;
  urgency: "high" | "medium" | "low";
}

export interface RestaurantState {
  bills: Bill[];
  stock: IngredientStock[];
  initializedAt: string;
  lastUpdated: string;
}

export interface RestaurantSnapshot {
  restaurant: { name: string; location: string; tagline: string };
  bills: Bill[];
  menu: MenuItem[];
  stock: IngredientStock[];
  hourlySales: HourlySales[];
  topItems: ItemSalesStats[];
  categoryShare: CategoryShare[];
  forecast: DailyForecast[];
  aiInsights: AIInsight[];
  restockPredictions: RestockPrediction[];
  totals: {
    revenueToday: number;
    ordersToday: number;
    avgTicket: number;
    profitMargin: number;
    revenueWeek: number;
    unitsSoldToday: number;
  };
}
