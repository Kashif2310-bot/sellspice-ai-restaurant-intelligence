import { runOcrPipeline } from "./ocr/pipeline";

export interface ParsedBillItem {
  name: string;
  qty: number;
  price: number;
  menuItemId?: string | null;
  confidence?: number;
  matchType?: string;
}

export interface ParsedBill {
  items: ParsedBillItem[];
  subtotal?: number;
  gst?: number;
  total?: number;
  paymentMethod?: string;
  averageConfidence?: number;
}

export async function parseBillImage(file: File): Promise<ParsedBill> {
  const result = await runOcrPipeline(file);
  return {
    items: result.items.map((i) => ({
      name: i.resolvedName,
      qty: i.qty,
      price: i.price,
      menuItemId: i.menuItemId,
      confidence: i.confidence,
      matchType: i.matchType,
    })),
    subtotal: result.subtotal,
    gst: result.gst,
    total: result.total,
    paymentMethod: result.paymentMethod,
    averageConfidence: result.averageConfidence,
  };
}
