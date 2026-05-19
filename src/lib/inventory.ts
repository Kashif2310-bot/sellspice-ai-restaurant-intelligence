import type { Ingredient, RecipeLine } from "./types";

export const ingredients: Ingredient[] = [
  { id: "ing-bun", name: "Burger Buns", unit: "pcs", parLevel: 400, costPerUnit: 8 },
  { id: "ing-patty-veg", name: "Veg Patty", unit: "pcs", parLevel: 200, costPerUnit: 22 },
  { id: "ing-patty-chicken", name: "Chicken Patty", unit: "pcs", parLevel: 350, costPerUnit: 38 },
  { id: "ing-patty-lamb", name: "Lamb Patty", unit: "pcs", parLevel: 80, costPerUnit: 65 },
  { id: "ing-paneer", name: "Paneer Blocks", unit: "kg", parLevel: 15, costPerUnit: 320 },
  { id: "ing-cheese", name: "Cheddar Slices", unit: "pcs", parLevel: 500, costPerUnit: 6 },
  { id: "ing-mozzarella", name: "Mozzarella", unit: "kg", parLevel: 8, costPerUnit: 480 },
  { id: "ing-lettuce", name: "Lettuce", unit: "kg", parLevel: 12, costPerUnit: 45 },
  { id: "ing-tomato", name: "Tomato", unit: "kg", parLevel: 20, costPerUnit: 35 },
  { id: "ing-onion", name: "Onion", unit: "kg", parLevel: 15, costPerUnit: 28 },
  { id: "ing-potato", name: "Frozen Fries", unit: "kg", parLevel: 40, costPerUnit: 85 },
  { id: "ing-bread-sub", name: "Sub Rolls", unit: "pcs", parLevel: 150, costPerUnit: 12 },
  { id: "ing-bread-panini", name: "Panini Bread", unit: "pcs", parLevel: 80, costPerUnit: 18 },
  { id: "ing-sauce-peri", name: "Peri-Peri Sauce", unit: "L", parLevel: 5, costPerUnit: 280 },
  { id: "ing-sauce-mayo", name: "Mayonnaise", unit: "L", parLevel: 4, costPerUnit: 180 },
  { id: "ing-chocolate", name: "Chocolate Compound", unit: "kg", parLevel: 6, costPerUnit: 420 },
  { id: "ing-cream", name: "Fresh Cream", unit: "L", parLevel: 8, costPerUnit: 95 },
  { id: "ing-cream-cheese", name: "Cream Cheese", unit: "kg", parLevel: 5, costPerUnit: 520 },
  { id: "ing-coffee", name: "Coffee Beans", unit: "kg", parLevel: 4, costPerUnit: 680 },
  { id: "ing-milk", name: "Full Cream Milk", unit: "L", parLevel: 30, costPerUnit: 58 },
  { id: "ing-ice-cream", name: "Vanilla Ice Cream", unit: "L", parLevel: 10, costPerUnit: 120 },
  { id: "ing-mint", name: "Fresh Mint", unit: "bunches", parLevel: 30, costPerUnit: 15 },
  { id: "ing-lime", name: "Lime", unit: "kg", parLevel: 5, costPerUnit: 60 },
  { id: "ing-egg", name: "Eggs", unit: "pcs", parLevel: 200, costPerUnit: 7 },
  { id: "ing-prawns", name: "Prawns", unit: "kg", parLevel: 3, costPerUnit: 850 },
  { id: "ing-fish", name: "Fish Fillet", unit: "kg", parLevel: 4, costPerUnit: 620 },
  { id: "ing-flour", name: "All-Purpose Flour", unit: "kg", parLevel: 25, costPerUnit: 42 },
  { id: "ing-butter", name: "Butter", unit: "kg", parLevel: 8, costPerUnit: 480 },
  { id: "ing-jalapeno", name: "Jalapenos", unit: "kg", parLevel: 3, costPerUnit: 180 },
  { id: "ing-mango", name: "Mango Pulp", unit: "kg", parLevel: 4, costPerUnit: 120 },
];

/** Recipe BOM: menu item id → ingredient consumption per 1 unit sold */
export const recipes: Record<string, RecipeLine[]> = {
  // Burgers
  "brg-001": [{ ingredientId: "ing-bun", qty: 1 }, { ingredientId: "ing-patty-veg", qty: 1 }, { ingredientId: "ing-cheese", qty: 2 }, { ingredientId: "ing-lettuce", qty: 0.02 }, { ingredientId: "ing-tomato", qty: 0.03 }, { ingredientId: "ing-onion", qty: 0.02 }, { ingredientId: "ing-sauce-mayo", qty: 0.02 }],
  "brg-002": [{ ingredientId: "ing-bun", qty: 1 }, { ingredientId: "ing-patty-chicken", qty: 1 }, { ingredientId: "ing-cheese", qty: 2 }, { ingredientId: "ing-lettuce", qty: 0.02 }, { ingredientId: "ing-tomato", qty: 0.03 }],
  "brg-003": [{ ingredientId: "ing-bun", qty: 1 }, { ingredientId: "ing-patty-veg", qty: 1 }, { ingredientId: "ing-lettuce", qty: 0.02 }, { ingredientId: "ing-tomato", qty: 0.02 }],
  "brg-010": [{ ingredientId: "ing-bun", qty: 1 }, { ingredientId: "ing-patty-chicken", qty: 1.2 }, { ingredientId: "ing-cheese", qty: 2 }, { ingredientId: "ing-sauce-peri", qty: 0.03 }],
  "brg-011": [{ ingredientId: "ing-bun", qty: 1 }, { ingredientId: "ing-patty-chicken", qty: 1 }, { ingredientId: "ing-cheese", qty: 3 }, { ingredientId: "ing-sauce-mayo", qty: 0.03 }],
  "brg-012": [{ ingredientId: "ing-bun", qty: 1 }, { ingredientId: "ing-patty-chicken", qty: 1 }, { ingredientId: "ing-cheese", qty: 2 }, { ingredientId: "ing-butter", qty: 0.02 }],
  "brg-014": [{ ingredientId: "ing-bun", qty: 1 }, { ingredientId: "ing-patty-chicken", qty: 1 }, { ingredientId: "ing-sauce-peri", qty: 0.04 }],
  "brg-018": [{ ingredientId: "ing-bun", qty: 1 }, { ingredientId: "ing-patty-lamb", qty: 1 }, { ingredientId: "ing-cheese", qty: 2 }],

  // Sides
  "sid-005": [{ ingredientId: "ing-mozzarella", qty: 0.08 }, { ingredientId: "ing-flour", qty: 0.03 }],
  "sid-006": [{ ingredientId: "ing-jalapeno", qty: 0.05 }, { ingredientId: "ing-cheese", qty: 2 }, { ingredientId: "ing-mozzarella", qty: 0.04 }],
  "sid-011": [{ ingredientId: "ing-mozzarella", qty: 0.06 }, { ingredientId: "ing-butter", qty: 0.02 }],
  "sid-013": [{ ingredientId: "ing-patty-chicken", qty: 0.5 }, { ingredientId: "ing-sauce-peri", qty: 0.03 }],
  "sid-014": [{ ingredientId: "ing-patty-chicken", qty: 0.8 }, { ingredientId: "ing-sauce-peri", qty: 0.05 }],
  "sid-017": [{ ingredientId: "ing-prawns", qty: 0.15 }, { ingredientId: "ing-butter", qty: 0.03 }],

  // Fries
  "fry-001": [{ ingredientId: "ing-potato", qty: 0.15 }],
  "fry-002": [{ ingredientId: "ing-potato", qty: 0.15 }, { ingredientId: "ing-sauce-peri", qty: 0.02 }],
  "fry-003": [{ ingredientId: "ing-potato", qty: 0.15 }, { ingredientId: "ing-mozzarella", qty: 0.05 }, { ingredientId: "ing-cheese", qty: 1 }],
  "fry-007": [{ ingredientId: "ing-potato", qty: 0.15 }, { ingredientId: "ing-patty-chicken", qty: 0.3 }, { ingredientId: "ing-mozzarella", qty: 0.04 }],

  // Desserts
  "dst-001": [{ ingredientId: "ing-chocolate", qty: 0.06 }, { ingredientId: "ing-cream", qty: 0.05 }, { ingredientId: "ing-egg", qty: 1 }],
  "dst-002": [{ ingredientId: "ing-chocolate", qty: 0.08 }, { ingredientId: "ing-butter", qty: 0.03 }, { ingredientId: "ing-egg", qty: 1 }],
  "dst-003": [{ ingredientId: "ing-chocolate", qty: 0.12 }, { ingredientId: "ing-cream", qty: 0.08 }, { ingredientId: "ing-egg", qty: 2 }],
  "dst-007": [{ ingredientId: "ing-chocolate", qty: 0.1 }, { ingredientId: "ing-egg", qty: 2 }],
  "dst-012": [{ ingredientId: "ing-ice-cream", qty: 0.12 }, { ingredientId: "ing-chocolate", qty: 0.04 }],
  "dst-014": [{ ingredientId: "ing-cream-cheese", qty: 0.08 }, { ingredientId: "ing-chocolate", qty: 0.04 }],
  "dst-018": [{ ingredientId: "ing-flour", qty: 0.04 }, { ingredientId: "ing-butter", qty: 0.02 }, { ingredientId: "ing-chocolate", qty: 0.05 }],

  // Beverages
  "bev-001": [{ ingredientId: "ing-mint", qty: 0.3 }, { ingredientId: "ing-lime", qty: 0.02 }],
  "bev-008": [{ ingredientId: "ing-coffee", qty: 0.02 }, { ingredientId: "ing-milk", qty: 0.15 }],
  "bev-009": [{ ingredientId: "ing-coffee", qty: 0.03 }, { ingredientId: "ing-milk", qty: 0.2 }, { ingredientId: "ing-cream", qty: 0.03 }],
  "bev-010": [{ ingredientId: "ing-coffee", qty: 0.03 }, { ingredientId: "ing-milk", qty: 0.2 }, { ingredientId: "ing-chocolate", qty: 0.03 }],
  "bev-013": [{ ingredientId: "ing-milk", qty: 0.25 }, { ingredientId: "ing-chocolate", qty: 0.05 }, { ingredientId: "ing-ice-cream", qty: 0.08 }],
  "bev-018": [{ ingredientId: "ing-chocolate", qty: 0.06 }, { ingredientId: "ing-milk", qty: 0.2 }, { ingredientId: "ing-cream", qty: 0.04 }],

  // Combos — sum of components (handled in engine)
  "cmb-001": [{ ingredientId: "ing-bun", qty: 1 }, { ingredientId: "ing-patty-veg", qty: 1 }, { ingredientId: "ing-potato", qty: 0.15 }, { ingredientId: "ing-coffee", qty: 0.02 }, { ingredientId: "ing-milk", qty: 0.15 }],
  "cmb-002": [{ ingredientId: "ing-bun", qty: 1 }, { ingredientId: "ing-patty-chicken", qty: 1.2 }, { ingredientId: "ing-potato", qty: 0.15 }, { ingredientId: "ing-sauce-peri", qty: 0.02 }, { ingredientId: "ing-milk", qty: 0.25 }, { ingredientId: "ing-chocolate", qty: 0.05 }],
};

/** Default recipe for items without explicit BOM */
export function getRecipe(menuItemId: string, category: string): RecipeLine[] {
  if (recipes[menuItemId]) return recipes[menuItemId];
  if (category === "Burgers") return recipes["brg-003"];
  if (category === "Fries") return recipes["fry-001"];
  if (category === "Desserts") return [{ ingredientId: "ing-chocolate", qty: 0.05 }, { ingredientId: "ing-cream", qty: 0.03 }];
  if (category === "Beverages") return [{ ingredientId: "ing-milk", qty: 0.1 }];
  if (category === "Sides") return [{ ingredientId: "ing-mozzarella", qty: 0.04 }];
  return [{ ingredientId: "ing-flour", qty: 0.02 }];
}

export function createInitialStock(): import("./types").IngredientStock[] {
  return ingredients.map((ing) => {
    const initial = ing.parLevel * (0.55 + Math.random() * 0.35);
    return {
      ingredientId: ing.id,
      name: ing.name,
      unit: ing.unit,
      initial: Math.round(initial * 10) / 10,
      used: 0,
      remaining: Math.round(initial * 10) / 10,
      parLevel: ing.parLevel,
      status: "ok" as const,
    };
  });
}

export function computeStockStatus(remaining: number, parLevel: number): import("./types").StockStatus {
  const ratio = remaining / parLevel;
  if (ratio <= 0.12) return "critical";
  if (ratio <= 0.28) return "low";
  return "ok";
}
