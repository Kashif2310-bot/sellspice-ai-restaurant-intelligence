import type { MenuItem } from "@/lib/types";
import { normalizeForMatch } from "@/lib/ocr/textCleaning";

/**
 * Hash Map — O(1) average menu/item retrieval by id and normalized name.
 * Business: OCR matching, inventory BOM lookup, POS item resolution.
 */

export class MenuHashIndex {
  private byId = new Map<string, MenuItem>();
  private byName = new Map<string, MenuItem>();

  constructor(items: MenuItem[]) {
    for (const item of items) {
      this.byId.set(item.id, item);
      this.byName.set(normalizeForMatch(item.name), item);
    }
  }

  getById(id: string): MenuItem | undefined {
    return this.byId.get(id);
  }

  getByName(name: string): MenuItem | undefined {
    return this.byName.get(normalizeForMatch(name));
  }

  size(): number {
    return this.byId.size;
  }
}

/** Time: O(1) avg get | Space: O(n) */
