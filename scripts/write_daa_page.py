from pathlib import Path

content = '''/**
 * Hidden faculty demo panel.
 * Access: /app/daa or Ctrl+Shift+D
 */
import { Topbar } from "@/components/layout/Topbar";
import { ALGORITHM_REGISTRY, simulateTrufflesDeliveryRoute } from "@/algorithms";
import { motion } from "framer-motion";
import { Brain, Code2, Route } from "lucide-react";
import { Link } from "react-router-dom";

const categoryLabel: Record<string, string> = {
  greedy: "Greedy",
  dynamicProgramming: "Dynamic Programming",
  sorting: "Sorting",
  searching: "Searching",
  graph: "Graph",
  hashMaps: "Hash Maps",
};

export default function AlgorithmInsights() {
  const route = simulateTrufflesDeliveryRoute();

  return (
    <motion.div>
      <Topbar title="Algorithm Insights" subtitle="DAA module map · faculty view" />
      <motion.div className="px-6 lg:px-10 py-8 space-y-8 max-w-5xl">
        <motion.div className="glass rounded-2xl p-5 border border-primary/20 flex items-start gap-4">
          <Brain className="w-6 h-6 text-primary shrink-0 mt-0.5" />
          <motion.div className="text-sm text-muted-foreground">
            <p className="text-foreground font-medium mb-1">SELLSPICE uses real algorithm implementations</p>
            <p>
              Source: <code className="font-mono text-primary text-xs">src/algorithms/</code>
            </p>
            <p className="mt-2 text-xs">
              <kbd className="px-1.5 py-0.5 rounded bg-secondary font-mono">Ctrl+Shift+D</kbd>{" "}
              <Link to="/app" className="text-primary hover:underline">Back to app</Link>
            </p>
          </motion.div>
        </motion.div>

        {route && (
          <motion.div className="glass rounded-2xl p-5">
            <h3 className="font-display font-semibold flex items-center gap-2">
              <Route className="w-4 h-4 text-primary" />
              Dijkstra delivery route demo
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              {route.path.join(" → ")} · {route.totalKm} km · ~{route.etaMinutes} min
            </p>
          </motion.div>
        )}

        <motion.div className="space-y-4">
          {ALGORITHM_REGISTRY.map((algo, i) => (
            <motion.div
              key={algo.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass rounded-2xl p-5 border border-border/50"
            >
              <motion.div className="flex items-center gap-2 mb-2">
                <Code2 className="w-4 h-4 text-primary" />
                <h3 className="font-display font-semibold">{algo.name}</h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                  {categoryLabel[algo.category] ?? algo.category}
                </span>
              </motion.div>
              <p className="text-sm"><span className="text-muted-foreground">Used in:</span> {algo.usedIn}</p>
              <p className="text-xs font-mono mt-1">Time {algo.timeComplexity} · Space {algo.spaceComplexity}</p>
              <p className="text-sm text-muted-foreground mt-2">{algo.businessUseCase}</p>
              <p className="font-mono text-xs text-primary mt-2">{algo.sourceFile}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
'''

Path("src/pages/AlgorithmInsights.tsx").write_text(content, encoding="utf-8")
print("ok")
