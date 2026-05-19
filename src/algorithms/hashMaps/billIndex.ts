import type { Bill } from "@/lib/types";

/**
 * Hash Map index for bills — O(1) lookup by bill ID.
 */

export class BillHashIndex {
  private map = new Map<string, Bill>();

  constructor(bills: Bill[]) {
    for (const b of bills) this.map.set(b.id, b);
  }

  get(id: string): Bill | undefined {
    return this.map.get(id);
  }

  has(id: string): boolean {
    return this.map.has(id);
  }
}

/** Time: O(1) avg | Space: O(n) */
