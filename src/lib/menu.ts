import type { MenuItem } from "./types";
import { matchOcrItems } from "./ocr/itemMatcher";

/** Truffles · Sanjaynagar — menu inspired by official Truffles outlets (80FT Road, BLR) */
export const GST_RATE = 0.05; // 5% GST inclusive pricing
export const PACKAGING_CHARGE = 15;

export const restaurantInfo = {
  name: "Truffles",
  location: "Sanjaynagar · 80 Feet Road, Bangalore",
  tagline: "Burgers · Steaks · Shakes · Desserts",
  mapsUrl: "https://maps.google.com/?q=Truffles+Sanjaynagar+Bangalore",
};

const item = (
  id: string,
  name: string,
  category: string,
  price: number,
  dietary: "veg" | "non-veg",
  tags: string[] = [],
  subcategory?: string
): MenuItem => ({ id, name, category, subcategory, price, dietary, tags });

export const menuItems: MenuItem[] = [
  // ── Burgers (star category — student crowd favorites) ──
  item("brg-001", "All American Cheeseburger", "Burgers", 250, "veg", ["bestseller", "student-fav"]),
  item("brg-002", "All American Cheeseburger (Chicken)", "Burgers", 295, "non-veg", ["bestseller"]),
  item("brg-003", "Veg Burger", "Burgers", 180, "veg", ["value"]),
  item("brg-004", "Cheese Burger", "Burgers", 190, "veg"),
  item("brg-005", "Cottage Cheese Burger", "Burgers", 195, "veg"),
  item("brg-006", "Mexican Bean Burger", "Burgers", 185, "veg", ["student-fav"]),
  item("brg-007", "Butter Paneer Burger", "Burgers", 205, "veg"),
  item("brg-008", "Tandoori Paneer Burger", "Burgers", 205, "veg"),
  item("brg-009", "Peri-Peri Paneer Burger", "Burgers", 205, "veg", ["spicy"]),
  item("brg-010", "The Truffles Rooster", "Burgers", 250, "non-veg", ["signature", "bestseller"]),
  item("brg-011", "Chicken Rocky Road", "Burgers", 225, "non-veg", ["bestseller"]),
  item("brg-012", "Butter Chicken Burger", "Burgers", 225, "non-veg"),
  item("brg-013", "Tex Mex Chicken Burger", "Burgers", 225, "non-veg", ["student-fav"]),
  item("brg-014", "Peri-Peri Chicken Burger", "Burgers", 225, "non-veg", ["spicy", "bestseller"]),
  item("brg-015", "Tandoori Chicken Burger", "Burgers", 215, "non-veg"),
  item("brg-016", "Chicken Fillet Burger", "Burgers", 205, "non-veg"),
  item("brg-017", "Korean Chicken Burger", "Burgers", 275, "non-veg", ["trending"]),
  item("brg-018", "Lamb Burger", "Burgers", 250, "non-veg", ["premium"]),
  item("brg-019", "Fish Fillet Burger (Tartar)", "Burgers", 215, "non-veg"),

  // ── Truffles Sides ──
  item("sid-001", "Spaghetti Cheese Balls", "Sides", 185, "veg"),
  item("sid-002", "Stuffed Fungi", "Sides", 190, "veg"),
  item("sid-003", "Fiery Baby Corn", "Sides", 195, "veg", ["spicy"]),
  item("sid-004", "Fiery Potato", "Sides", 195, "veg", ["spicy"]),
  item("sid-005", "Fried Mozzarella Stix", "Sides", 215, "veg", ["bestseller"]),
  item("sid-006", "Jalapeno Poppers", "Sides", 215, "veg"),
  item("sid-007", "Nachos with Cheese", "Sides", 215, "veg", ["student-fav"]),
  item("sid-008", "Peri-Peri Paneer", "Sides", 240, "veg", ["spicy"]),
  item("sid-009", "Devil's Paneer", "Sides", 240, "veg", ["spicy"]),
  item("sid-010", "All American Nachos (Veg)", "Sides", 290, "veg"),
  item("sid-011", "Garlic Bread with Cheese (4 pcs)", "Sides", 155, "veg", ["bestseller"]),
  item("sid-012", "Chicken Popcorn", "Sides", 220, "non-veg"),
  item("sid-013", "Chicken Wings (Peri-Peri)", "Sides", 250, "non-veg", ["bestseller"]),
  item("sid-014", "Devil's Chicken", "Sides", 310, "non-veg", ["spicy"]),
  item("sid-015", "Fish Fingers", "Sides", 295, "non-veg"),
  item("sid-016", "Peri-Peri Chicken", "Sides", 310, "non-veg"),
  item("sid-017", "Peri-Peri Prawns", "Sides", 395, "non-veg", ["premium"]),
  item("sid-018", "Butter Garlic Prawns", "Sides", 395, "non-veg", ["premium"]),

  // ── Long Breads ──
  item("lb-001", "Cottage Cheese Sub", "Long Breads", 165, "veg"),
  item("lb-002", "Tandoori Paneer Sub", "Long Breads", 165, "veg"),
  item("lb-003", "Russian Salad Sub", "Long Breads", 135, "veg", ["value"]),
  item("lb-004", "Chicken Mayo Sub", "Long Breads", 180, "non-veg"),
  item("lb-005", "Devil's Chicken Sub", "Long Breads", 190, "non-veg", ["spicy"]),
  item("lb-006", "Kheema Sub", "Long Breads", 205, "non-veg"),
  item("lb-007", "Chicken Hot Dog", "Long Breads", 165, "non-veg", ["student-fav"]),

  // ── Sandwiches & Panini ──
  item("snd-001", "Grilled Cheese Sandwich", "Sandwiches", 135, "veg", ["value"]),
  item("snd-002", "Butter Paneer Sandwich", "Sandwiches", 185, "veg"),
  item("snd-003", "Veg Club Sandwich", "Sandwiches", 195, "veg"),
  item("snd-004", "Chicken Ham Cheese Sandwich", "Sandwiches", 190, "non-veg"),
  item("snd-005", "Devil's Chicken Sandwich", "Sandwiches", 200, "non-veg"),
  item("snd-006", "Non Veg Club Sandwich", "Sandwiches", 250, "non-veg"),
  item("pni-001", "Thai Cottage Cheese Panini", "Panini", 290, "veg"),
  item("pni-002", "Mozzarella & Pesto Panini", "Panini", 295, "veg"),
  item("pni-003", "Fried Chicken Panini", "Panini", 275, "non-veg"),
  item("pni-004", "Ghee Roast Chicken Panini", "Panini", 280, "non-veg"),

  // ── Fries & Wedges ──
  item("fry-001", "Classic Fries", "Fries", 135, "veg", ["bestseller", "addon"]),
  item("fry-002", "Peri-Peri Dusted Fries", "Fries", 165, "veg", ["bestseller", "spicy"]),
  item("fry-003", "Cheesy Fries", "Fries", 220, "veg", ["bestseller"]),
  item("fry-004", "Saucy Peri-Peri Fries", "Fries", 175, "veg"),
  item("fry-005", "Buffalo Fries", "Fries", 195, "veg", ["spicy"]),
  item("fry-006", "Wedges", "Fries", 150, "veg"),
  item("fry-007", "Chicken Cheesy Fries", "Fries", 250, "non-veg", ["bestseller"]),
  item("fry-008", "Tandoori Chicken & Cheese Fries", "Fries", 255, "non-veg"),

  // ── Salads ──
  item("sal-001", "Caesar Salad (Veg)", "Salads", 200, "veg"),
  item("sal-002", "Greek Salad", "Salads", 200, "veg"),
  item("sal-003", "Crunchy Chicken Salad", "Salads", 270, "non-veg"),
  item("sal-004", "Tandoori Chicken Salad", "Salads", 260, "non-veg"),

  // ── Desserts ──
  item("dst-001", "Chocolate Mousse Cake", "Desserts", 170, "veg", ["bestseller"], "Cakes"),
  item("dst-002", "Chocolate Lava Cake", "Desserts", 105, "veg", ["bestseller", "student-fav"], "Cakes"),
  item("dst-003", "Death by Chocolate Cake", "Desserts", 155, "veg", ["signature", "bestseller"], "Cakes"),
  item("dst-004", "Dutch Truffle Cake", "Desserts", 155, "veg", ["bestseller"], "Cakes"),
  item("dst-005", "Bulls Eye", "Desserts", 155, "veg", [], "Cakes"),
  item("dst-006", "Bella Bento", "Desserts", 395, "veg", ["premium"], "Cakes"),
  item("dst-007", "Ferrero Rocher Cake", "Desserts", 160, "non-veg", ["bestseller"], "Cakes"),
  item("dst-008", "Tiramisu Brownie", "Desserts", 200, "non-veg", ["bestseller"], "Cakes"),
  item("dst-009", "Tres Leches", "Desserts", 220, "non-veg", [], "Cakes"),
  item("dst-010", "Blueberry Cheesecake Jar", "Desserts", 185, "veg", [], "Jars"),
  item("dst-011", "Tiramisu Jar", "Desserts", 205, "non-veg", ["bestseller"], "Jars"),
  item("dst-012", "Oreo & Cookie Fudge Sundae", "Desserts", 255, "veg", ["bestseller"], "Sundae"),
  item("dst-013", "Brownie Fudge Sundae", "Desserts", 255, "non-veg", ["bestseller"], "Sundae"),
  item("dst-014", "Chocolate Cheesecake", "Desserts", 190, "veg", [], "Cheesecake"),
  item("dst-015", "Salted Caramel Cheesecake", "Desserts", 240, "non-veg", ["premium"], "Cheesecake"),
  item("dst-016", "Apple Pie", "Desserts", 165, "veg", [], "Pie"),
  item("dst-017", "Banoffee Pie", "Desserts", 200, "veg", [], "Pie"),
  item("dst-018", "Chocolate Tart", "Desserts", 75, "veg", ["value", "student-fav"], "Tart"),
  item("dst-019", "Mango Tart", "Desserts", 200, "veg", ["seasonal"], "Tart"),

  // ── Beverages ──
  item("bev-001", "Classic Mojito", "Beverages", 170, "veg", ["bestseller"], "Mojito"),
  item("bev-002", "Watermelon Mojito", "Beverages", 170, "veg", ["seasonal"], "Mojito"),
  item("bev-003", "Strawberry Mojito", "Beverages", 170, "veg", [], "Mojito"),
  item("bev-004", "Blue Curaçao Granita", "Beverages", 145, "veg", [], "Granita"),
  item("bev-005", "Strawberry Smoothie", "Beverages", 210, "veg", ["bestseller"], "Smoothie"),
  item("bev-006", "Mango Smoothie", "Beverages", 210, "veg", ["seasonal"], "Smoothie"),
  item("bev-007", "Mixed Berry Smoothie", "Beverages", 240, "veg", [], "Smoothie"),
  item("bev-008", "Iced Latte", "Beverages", 160, "veg", ["bestseller", "student-fav"], "Cold Coffee"),
  item("bev-009", "Irish Cold Coffee", "Beverages", 200, "veg", ["bestseller"], "Cold Coffee"),
  item("bev-010", "Oreo Cold Coffee", "Beverages", 220, "veg", ["bestseller", "student-fav"], "Cold Coffee"),
  item("bev-011", "Brownie Point Cold Coffee", "Beverages", 230, "veg", ["signature"], "Cold Coffee"),
  item("bev-012", "Ferrero Rocher Cold Coffee", "Beverages", 230, "veg", ["premium"], "Cold Coffee"),
  item("bev-013", "Thicc Choco Shake", "Beverages", 230, "veg", ["bestseller", "student-fav"], "Thicc Shakes"),
  item("bev-014", "Mango Royale Shake", "Beverages", 230, "veg", ["seasonal"], "Thicc Shakes"),
  item("bev-015", "Berry Delulu Shake", "Beverages", 230, "veg", ["trending"], "Thicc Shakes"),
  item("bev-016", "Cappuccino", "Beverages", 150, "veg", [], "Hotties"),
  item("bev-017", "Cafe Mocha", "Beverages", 150, "veg", [], "Hotties"),
  item("bev-018", "European Hot Chocolate", "Beverages", 195, "veg", ["bestseller"], "Hotties"),
  item("bev-019", "Very Vanilla Frappe", "Beverages", 160, "veg", [], "Frappe"),
  item("bev-020", "Choco Mocha Frappe", "Beverages", 210, "veg", ["bestseller"], "Frappe"),
  item("bev-021", "Peanut Butter & Nutella Frappe", "Beverages", 215, "veg", ["premium"], "Frappe"),
  item("bev-022", "Masala Tea", "Beverages", 95, "veg", ["value"], "Teas"),
  item("bev-023", "Fresh Lime Soda", "Beverages", 115, "veg", ["value", "student-fav"], "Refreshers"),
  item("bev-024", "Aerated Beverages", "Beverages", 80, "veg", ["value"], "Refreshers"),

  // ── Combos (Truffles-style bundles) ──
  {
    id: "cmb-001",
    name: "Student Power Combo",
    category: "Combos",
    price: 299,
    dietary: "veg",
    tags: ["combo", "student-fav", "value"],
    isCombo: true,
    comboItems: ["brg-003", "fry-001", "bev-008"],
  },
  {
    id: "cmb-002",
    name: "Burger + Fries + Shake",
    category: "Combos",
    price: 449,
    dietary: "non-veg",
    tags: ["combo", "bestseller"],
    isCombo: true,
    comboItems: ["brg-010", "fry-002", "bev-013"],
  },
  {
    id: "cmb-003",
    name: "Date Night Dessert Duo",
    category: "Combos",
    price: 399,
    dietary: "veg",
    tags: ["combo", "premium"],
    isCombo: true,
    comboItems: ["dst-003", "dst-012", "bev-018"],
  },
  {
    id: "cmb-004",
    name: "MS Ramaiah Lunch Rush",
    category: "Combos",
    price: 349,
    dietary: "non-veg",
    tags: ["combo", "student-fav"],
    isCombo: true,
    comboItems: ["brg-014", "fry-003", "bev-023"],
  },
];

export const menuById = new Map(menuItems.map((m) => [m.id, m]));
export const menuByName = new Map(menuItems.map((m) => [m.name.toLowerCase(), m]));

export const categories = [...new Set(menuItems.map((m) => m.category))];

export function findMenuItem(query: string): MenuItem | undefined {
  const matched = matchOcrItems([{ name: query, qty: 1, price: 0 }])[0];
  if (matched.menuItemId) return menuById.get(matched.menuItemId);
  return menuByName.get(query.toLowerCase().trim());
}
