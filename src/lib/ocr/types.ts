export interface RawOcrItem {
  name: string;
  qty: number;
  price: number;
}

export interface MatchedOcrItem extends RawOcrItem {
  /** Canonical display name — bill text preserved when exact; menu name when matched */
  resolvedName: string;
  menuItemId: string | null;
  confidence: number;
  matchType: "exact" | "normalized" | "token" | "fuzzy" | "unmatched";
  ocrRawName: string;
}

export interface OcrPipelineResult {
  items: MatchedOcrItem[];
  subtotal?: number;
  gst?: number;
  total?: number;
  paymentMethod?: string;
  averageConfidence: number;
}
