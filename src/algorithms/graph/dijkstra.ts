/**
 * Dijkstra's Algorithm — shortest delivery path on weighted graph.
 * Business: Delivery route optimization from Truffles Sanjaynagar to nearby nodes.
 */

export interface GraphNode {
  id: string;
  label: string;
}

export interface WeightedEdge {
  from: string;
  to: string;
  km: number;
}

export interface RouteResult {
  path: string[];
  totalKm: number;
  etaMinutes: number;
}

export function dijkstraShortestPath(
  nodes: GraphNode[],
  edges: WeightedEdge[],
  startId: string,
  endId: string
): RouteResult | null {
  const adj = new Map<string, { to: string; w: number }[]>();
  for (const e of edges) {
    if (!adj.has(e.from)) adj.set(e.from, []);
    adj.get(e.from)!.push({ to: e.to, w: e.km });
    if (!adj.has(e.to)) adj.set(e.to, []);
    adj.get(e.to)!.push({ to: e.from, w: e.km });
  }

  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const visited = new Set<string>();

  for (const n of nodes) {
    dist.set(n.id, Infinity);
    prev.set(n.id, null);
  }
  dist.set(startId, 0);

  while (visited.size < nodes.length) {
    let u: string | null = null;
    let best = Infinity;
    for (const [id, d] of dist) {
      if (!visited.has(id) && d < best) {
        best = d;
        u = id;
      }
    }
    if (u === null || best === Infinity) break;
    if (u === endId) break;
    visited.add(u);

    for (const { to, w } of adj.get(u) ?? []) {
      const alt = best + w;
      if (alt < (dist.get(to) ?? Infinity)) {
        dist.set(to, alt);
        prev.set(to, u);
      }
    }
  }

  if ((dist.get(endId) ?? Infinity) === Infinity) return null;

  const path: string[] = [];
  let cur: string | null = endId;
  while (cur) {
    path.unshift(cur);
    cur = prev.get(cur) ?? null;
  }

  const totalKm = dist.get(endId)!;
  const etaMinutes = Math.round((totalKm / 25) * 60 + path.length * 3);

  return { path, totalKm: Math.round(totalKm * 10) / 10, etaMinutes };
}

/** Time: O((V + E) log V) with binary heap; here O(V²) array scan | Space: O(V) */

/** Truffles Sanjaynagar delivery simulation graph */
export function simulateTrufflesDeliveryRoute(): RouteResult | null {
  const nodes: GraphNode[] = [
    { id: "truffles", label: "Truffles · 80FT Road" },
    { id: "ramaiah", label: "MS Ramaiah College" },
    { id: "bel", label: "New BEL Road offices" },
    { id: "sanjaynagar", label: "Sanjaynagar Park" },
    { id: "customer", label: "Delivery drop" },
  ];
  const edges: WeightedEdge[] = [
    { from: "truffles", to: "ramaiah", km: 0.6 },
    { from: "truffles", to: "bel", km: 2.1 },
    { from: "truffles", to: "sanjaynagar", km: 0.4 },
    { from: "ramaiah", to: "customer", km: 1.2 },
    { from: "bel", to: "customer", km: 1.8 },
    { from: "sanjaynagar", to: "customer", km: 0.9 },
    { from: "ramaiah", to: "sanjaynagar", km: 0.5 },
  ];
  return dijkstraShortestPath(nodes, edges, "truffles", "customer");
}
