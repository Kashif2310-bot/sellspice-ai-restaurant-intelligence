import type { AlgorithmMeta } from "./types";

export { mergeSort } from "./sorting/mergeSort";
export { quickSort } from "./sorting/quickSort";
export { rankTopSellingItems } from "./sorting/topSellingRank";
export { binarySearch, binarySearchByKey } from "./searching/binarySearch";
export { linearSearch } from "./searching/linearSearch";
export { MenuHashIndex } from "./hashMaps/menuIndex";
export { BillHashIndex } from "./hashMaps/billIndex";
export { greedyComboRecommendations } from "./greedy/comboOptimizer";
export { forecastDemandDP } from "./dynamicProgramming/inventoryForecast";
export { dijkstraShortestPath, simulateTrufflesDeliveryRoute } from "./graph/dijkstra";

/**
 * Faculty-facing registry — maps each DAA topic to production usage in SELLSPICE.
 */
export const ALGORITHM_REGISTRY: AlgorithmMeta[] = [
  {
    id: "greedy-combo",
    name: "Greedy Algorithm",
    category: "greedy",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(n)",
    usedIn: "AI Insights · combo recommendations",
    businessUseCase:
      "Selects profit-maximized item bundles (burger + fries + shake) under a student budget cap.",
    sourceFile: "src/algorithms/greedy/comboOptimizer.ts",
  },
  {
    id: "dp-forecast",
    name: "Dynamic Programming",
    category: "dynamicProgramming",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    usedIn: "Forecast page · tomorrow demand",
    businessUseCase:
      "Predicts next-day revenue using weekday/weekend states from 7-day sales history.",
    sourceFile: "src/algorithms/dynamicProgramming/inventoryForecast.ts",
  },
  {
    id: "merge-sort",
    name: "Merge Sort",
    category: "sorting",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    usedIn: "Dashboard · top-selling rank",
    businessUseCase: "Stable ranking of dishes by revenue and units sold.",
    sourceFile: "src/algorithms/sorting/mergeSort.ts",
  },
  {
    id: "quick-sort",
    name: "Quick Sort",
    category: "sorting",
    timeComplexity: "O(n log n) average",
    spaceComplexity: "O(log n)",
    usedIn: "Analytics service · alternate sort",
    businessUseCase: "Fast in-memory sort for billing category breakdowns.",
    sourceFile: "src/algorithms/sorting/quickSort.ts",
  },
  {
    id: "binary-search",
    name: "Binary Search",
    category: "searching",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    usedIn: "Billing Intelligence · bill lookup",
    businessUseCase: "Instant lookup of transaction ID in sorted ledger.",
    sourceFile: "src/algorithms/searching/binarySearch.ts",
  },
  {
    id: "hash-menu",
    name: "Hash Map (Menu Index)",
    category: "hashMaps",
    timeComplexity: "O(1) average",
    spaceComplexity: "O(n)",
    usedIn: "OCR pipeline · menu resolution",
    businessUseCase: "O(1) menu item retrieval for bill scanning and inventory BOM.",
    sourceFile: "src/algorithms/hashMaps/menuIndex.ts",
  },
  {
    id: "hash-bill",
    name: "Hash Map (Bill Index)",
    category: "hashMaps",
    timeComplexity: "O(1) average",
    spaceComplexity: "O(n)",
    usedIn: "Billing Intelligence · transaction index",
    businessUseCase: "O(1) bill fetch by TRF- ID for support and audits.",
    sourceFile: "src/algorithms/hashMaps/billIndex.ts",
  },
  {
    id: "dijkstra",
    name: "Dijkstra's Algorithm",
    category: "graph",
    timeComplexity: "O(V²) implementation",
    spaceComplexity: "O(V)",
    usedIn: "Delivery route simulation",
    businessUseCase:
      "Shortest path from Truffles Sanjaynagar to MS Ramaiah / BEL Road delivery drops.",
    sourceFile: "src/algorithms/graph/dijkstra.ts",
  },
];
