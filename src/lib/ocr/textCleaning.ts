/**
 * Normalize OCR text while preserving meaningful dish-name characters.
 */

export function cleanOcrText(raw: string): string {
  return raw
    .replace(/[\u20B9₹]/g, "")
    .replace(/\bRs\.?\s*/gi, "")
    .replace(/\bINR\s*/gi, "")
    .replace(/\s+/g, " ")
    .replace(/[|]/g, "I")
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .trim();
}

export function normalizeForMatch(name: string): string {
  return cleanOcrText(name)
    .toLowerCase()
    .replace(/[^a-z0-9\s()&+-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseQuantity(raw: string | number | undefined): number {
  if (typeof raw === "number" && raw > 0) return Math.round(raw);
  if (!raw) return 1;
  const m = String(raw).match(/(\d+)/);
  return m ? Math.max(1, parseInt(m[1], 10)) : 1;
}

export function parsePrice(raw: string | number | undefined): number {
  if (typeof raw === "number" && raw > 0) return Math.round(raw);
  if (!raw) return 0;
  const cleaned = String(raw).replace(/[^\d.]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? Math.round(n) : 0;
}
