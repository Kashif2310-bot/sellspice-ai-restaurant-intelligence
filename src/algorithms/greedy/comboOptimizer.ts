import type { MenuItem } from "@/lib/types";

export interface ComboCandidate {
  items: MenuItem[];
  totalPrice: number;
  estimatedProfit: number;
  label: string;
}

/**
 * Greedy Algorithm — selects high-margin combo bundles under a budget cap.
 * Business: AI combo recommendations (student lunch, dinner upsell).
 *
 * Strategy: sort items by profit margin ratio descending, greedily pack until budget full.
 */

const MARGIN_BY_CATEGORY: Record<string, number> = {
  Burgers: 0.38,
  Beverages: 0.55,
  Fries: 0.62,
  Desserts: 0.48,
  Sides: 0.45,
  Combos: 0.35,
};

function margin(item: MenuItem): number {
  return MARGIN_BY_CATEGORY[item.category] ?? 0.34;
}

export function greedyComboRecommendations(
  menu: MenuItem[],
  budget: number,
  maxItems = 3
): ComboCandidate[] {
  const pool = menu
    .filter((m) => !m.isCombo && m.price <= budget)
    .map((m) => ({ item: m, score: margin(m) * m.price }))
    .sort((a, b) => b.score - a.score);

  const results: ComboCandidate[] = [];

  for (let i = 0; i < pool.length && results.length < 5; i++) {
    const picked: MenuItem[] = [pool[i].item];
    let spent = pool[i].item.price;
    let profit = pool[i].item.price * margin(pool[i].item);

    for (let j = i + 1; j < pool.length && picked.length < maxItems; j++) {
      const next = pool[j].item;
      if (spent + next.price > budget) continue;
      picked.push(next);
      spent += next.price;
      profit += next.price * margin(next);
    }

    if (picked.length >= 2) {
      results.push({
        items: picked,
        totalPrice: spent,
        estimatedProfit: Math.round(profit),
        label: picked.map((p) => p.name.split(" ")[0]).join(" + "),
      });
    }
  }

  return results.sort((a, b) => b.estimatedProfit - a.estimatedProfit).slice(0, 3);
}

/** Time: O(n²) greedy packing | Space: O(n) */
