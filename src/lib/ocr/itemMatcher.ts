import type { MenuItem } from "@/lib/types";
import { menuItems } from "@/lib/menu";
import { cleanOcrText, normalizeForMatch, parsePrice, parseQuantity } from "./textCleaning";
import type { MatchedOcrItem, RawOcrItem } from "./types";

const FUZZY_THRESHOLD = 0.82;
const TOKEN_THRESHOLD = 0.9;

interface MatchCandidate {
  item: MenuItem;
  score: number;
  type: MatchedOcrItem["matchType"];
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function similarity(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const dist = levenshtein(a, b);
  return 1 - dist / Math.max(a.length, b.length);
}

function tokenScore(ocr: string, menu: string): number {
  const oTokens = ocr.split(" ").filter((t) => t.length > 1);
  const mTokens = menu.split(" ").filter((t) => t.length > 1);
  if (!oTokens.length || !mTokens.length) return 0;
  let hits = 0;
  for (const t of oTokens) {
    if (mTokens.some((m) => m === t || m.includes(t) || t.includes(m))) hits++;
  }
  return hits / Math.max(oTokens.length, mTokens.length);
}

function findBestMatch(ocrName: string, catalog: MenuItem[]): MatchCandidate | null {
  const cleaned = cleanOcrText(ocrName);
  const norm = normalizeForMatch(cleaned);
  if (!norm) return null;

  const candidates: MatchCandidate[] = [];

  for (const item of catalog) {
    const menuNorm = normalizeForMatch(item.name);

    if (cleaned === item.name || norm === menuNorm) {
      return { item, score: 1, type: "exact" };
    }

    if (norm === menuNorm) {
      candidates.push({ item, score: 0.99, type: "normalized" });
      continue;
    }

    const ts = tokenScore(norm, menuNorm);
    if (ts >= TOKEN_THRESHOLD) {
      candidates.push({ item, score: ts, type: "token" });
      continue;
    }

    const sim = similarity(norm, menuNorm);
    if (sim >= FUZZY_THRESHOLD) {
      candidates.push({ item, score: sim, type: "fuzzy" });
    }
  }

  if (!candidates.length) return null;
  candidates.sort((a, b) => b.score - a.score);

  const best = candidates[0];
  const second = candidates[1];
  if (second && best.score - second.score < 0.05) {
    const bestLen = Math.abs(normalizeForMatch(best.item.name).length - norm.length);
    const secondLen = Math.abs(normalizeForMatch(second.item.name).length - norm.length);
    return bestLen <= secondLen ? best : second;
  }
  return best;
}

/**
 * Resolve OCR lines to menu items.
 * Priority: preserve exact bill wording → canonical menu name when matched.
 */
export function matchOcrItems(
  rawItems: RawOcrItem[],
  catalog: MenuItem[] = menuItems
): MatchedOcrItem[] {
  return rawItems.map((raw) => {
    const ocrRawName = cleanOcrText(raw.name);
    const qty = parseQuantity(raw.qty);
    const price = parsePrice(raw.price);
    const match = findBestMatch(ocrRawName, catalog);

    if (match && match.score >= FUZZY_THRESHOLD) {
      const useMenuPrice = price <= 0 || Math.abs(price - match.item.price) / match.item.price < 0.35;
      return {
        name: match.item.name,
        resolvedName: match.item.name,
        ocrRawName,
        menuItemId: match.item.id,
        qty,
        price: useMenuPrice ? match.item.price : price,
        confidence: Math.round(match.score * 100) / 100,
        matchType: match.type,
      };
    }

    return {
      name: ocrRawName,
      resolvedName: ocrRawName,
      ocrRawName,
      menuItemId: null,
      qty,
      price,
      confidence: 0.5,
      matchType: "unmatched",
    };
  });
}

export function getMenuCatalogForOcr(): string[] {
  return menuItems.map((m) => m.name);
}
