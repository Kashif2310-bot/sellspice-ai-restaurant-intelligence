export const salesData = [
  { time: "9AM", sales: 240, profit: 80 },
  { time: "11AM", sales: 480, profit: 160 },
  { time: "1PM", sales: 920, profit: 340 },
  { time: "3PM", sales: 610, profit: 220 },
  { time: "5PM", sales: 780, profit: 290 },
  { time: "7PM", sales: 1340, profit: 510 },
  { time: "9PM", sales: 1620, profit: 640 },
  { time: "11PM", sales: 980, profit: 360 },
];

export const topItems = [
  { name: "Margherita Pizza", sold: 132, revenue: 39600, price: 300, trend: 12 },
  { name: "Classic Burger", sold: 100, revenue: 18000, price: 180, trend: 8 },
  { name: "Cold Coffee", sold: 87, revenue: 10440, price: 120, trend: 24 },
  { name: "Paneer Tikka", sold: 64, revenue: 19200, price: 300, trend: -4 },
  { name: "French Fries", sold: 58, revenue: 5800, price: 100, trend: 5 },
  { name: "Veg Pasta", sold: 42, revenue: 10500, price: 250, trend: 18 },
];

export const inventory = [
  { item: "Pizza Dough", used: 14.2, remaining: 4.8, unit: "kg", status: "low" },
  { item: "Mozzarella", used: 9.6, remaining: 6.4, unit: "kg", status: "ok" },
  { item: "Burger Buns", used: 100, remaining: 80, unit: "pcs", status: "ok" },
  { item: "Beef Patty", used: 100, remaining: 25, unit: "pcs", status: "critical" },
  { item: "Coffee Beans", used: 2.1, remaining: 3.4, unit: "kg", status: "ok" },
  { item: "Tomato", used: 18, remaining: 7, unit: "kg", status: "low" },
];

export const categoryShare = [
  { name: "Pizzas", value: 38 },
  { name: "Burgers", value: 22 },
  { name: "Beverages", value: 18 },
  { name: "Desserts", value: 12 },
  { name: "Others", value: 10 },
];

export const forecast = [
  { day: "Mon", actual: 12400, predicted: 12000 },
  { day: "Tue", actual: 11800, predicted: 12200 },
  { day: "Wed", actual: 13900, predicted: 13400 },
  { day: "Thu", actual: 14600, predicted: 14800 },
  { day: "Fri", actual: 18200, predicted: 17900 },
  { day: "Sat", actual: null, predicted: 21400 },
  { day: "Sun", actual: null, predicted: 19800 },
];

export const socialIdeas = [
  { title: "Behind-the-scenes pizza dough toss reel", hook: "POV: 3am dough magic 🍕", engagement: "High", tag: "Reels" },
  { title: "Customer reaction to new spicy combo", hook: "She wasn't ready for level 5 🔥", engagement: "Viral", tag: "TikTok" },
  { title: "Monsoon combo carousel post", hook: "Rain. Coffee. Vibes ☕", engagement: "Medium", tag: "Instagram" },
  { title: "Chef's secret sauce reveal teaser", hook: "We finally spilled the recipe...", engagement: "High", tag: "Reels" },
  { title: "College fest weekend special story", hook: "Group of 4? You eat for free.", engagement: "High", tag: "Story" },
  { title: "Time-lapse: 100 burgers in 60 seconds", hook: "Restaurant cardio 🏃", engagement: "Viral", tag: "Reels" },
];

export const aiInsights = [
  { type: "opportunity", title: "Push cold coffee combo 2–6 PM", detail: "Nearby college fest predicted to drive 35% more evening foot traffic. Bundle cold coffee + fries for ₹199.", impact: "+₹8,400 est." },
  { type: "warning", title: "Beef patty critically low", detail: "At current burn rate you'll run out by 8:30 PM tonight. Reorder 200 patties now.", impact: "Avoid stockout" },
  { type: "insight", title: "Paneer Tikka demand cooling", detail: "Down 4% w/w. Consider rotating to weekend-only or running a 15% off flash.", impact: "Reduce waste 9%" },
  { type: "opportunity", title: "Rainy evening = pasta surge", detail: "Weather model shows 80% rain after 6 PM. Pasta orders historically +42% in such conditions.", impact: "+₹5,200 est." },
];
