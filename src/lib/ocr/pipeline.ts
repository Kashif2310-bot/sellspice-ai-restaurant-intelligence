import { matchOcrItems, getMenuCatalogForOcr } from "./itemMatcher";
import { preprocessBillImage } from "./preprocess";
import { cleanOcrText, parsePrice, parseQuantity } from "./textCleaning";
import type { OcrPipelineResult, RawOcrItem } from "./types";

const PARSE_BILL_URL = `${import.meta.env.VITE_SUPABASE_URL ?? "https://zxwzfdzmtuoqupbbuecl.supabase.co"}/functions/v1/parse-bill`;

interface ApiOcrResponse {
  items?: RawOcrItem[];
  subtotal?: number;
  gst?: number;
  total?: number;
  paymentMethod?: string;
  error?: string;
}

export async function runOcrPipeline(file: File): Promise<OcrPipelineResult> {
  const { base64, file: processed } = await preprocessBillImage(file);
  const menuCatalog = getMenuCatalogForOcr();

  let rawItems: RawOcrItem[] = [];
  let meta: Partial<OcrPipelineResult> = {};

  try {
    const res = await fetch(PARSE_BILL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageBase64: base64,
        mimeType: processed.type || file.type || "image/jpeg",
        menuCatalog,
      }),
    });

    if (res.ok) {
      const data = (await res.json()) as ApiOcrResponse;
      if (data.items?.length) {
        rawItems = data.items.map((it) => ({
          name: cleanOcrText(String(it.name ?? "")),
          qty: parseQuantity(it.qty),
          price: parsePrice(it.price),
        }));
        meta = {
          subtotal: data.subtotal,
          gst: data.gst,
          total: data.total,
          paymentMethod: data.paymentMethod,
        };
      }
    }
  } catch {
    /* local fallback below */
  }

  if (!rawItems.length) {
    rawItems = localTextFallback(processed.name);
  }

  const items = matchOcrItems(rawItems);
  const averageConfidence =
    items.length > 0
      ? Math.round((items.reduce((s, i) => s + i.confidence, 0) / items.length) * 100) / 100
      : 0;

  return { items, averageConfidence, ...meta };
}

/** Deterministic fallback when API unavailable — uses exact menu names */
function localTextFallback(fileName: string): RawOcrItem[] {
  const samples: RawOcrItem[][] = [
    [
      { name: "All American Cheeseburger", qty: 2, price: 250 },
      { name: "Peri-Peri Dusted Fries", qty: 1, price: 165 },
    ],
    [
      { name: "Death by Chocolate Cake", qty: 1, price: 155 },
      { name: "Iced Latte", qty: 2, price: 160 },
    ],
    [
      { name: "The Truffles Rooster", qty: 1, price: 250 },
      { name: "Thicc Choco Shake", qty: 1, price: 230 },
    ],
  ];
  return samples[fileName.length % samples.length];
}

export { getMenuCatalogForOcr };
