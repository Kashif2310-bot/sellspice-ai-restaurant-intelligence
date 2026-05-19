export interface AlgorithmMeta {
  id: string;
  name: string;
  category: "greedy" | "dynamicProgramming" | "sorting" | "searching" | "graph" | "hashMaps";
  timeComplexity: string;
  spaceComplexity: string;
  usedIn: string;
  businessUseCase: string;
  sourceFile: string;
}
