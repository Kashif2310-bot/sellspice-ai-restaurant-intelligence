import { Topbar } from "@/components/layout/Topbar";
import { useRestaurant } from "@/context/RestaurantContext";
import { AlertTriangle, Boxes, Package, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

const statusColor = (s: string) => s === "critical" ? "text-destructive bg-destructive/10 border-destructive/30" : s === "low" ? "text-warning bg-warning/10 border-warning/30" : "text-primary bg-primary/10 border-primary/30";

export default function Inventory() {
  const { snapshot } = useRestaurant();
  const { stock, restockPredictions, totals } = snapshot;

  const lowCount = stock.filter((s) => s.status === "low").length;
  const criticalCount = stock.filter((s) => s.status === "critical").length;

  return (
    <div>
      <Topbar title="Inventory Intelligence" subtitle="Auto-deducted from sales · BOM-linked · Truffles kitchen" />
      <div className="px-6 lg:px-10 py-8 space-y-8">
        <motion.div className="grid md:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-5">
            <Package className="w-5 h-5 text-primary mb-3"/>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Tracked SKUs</div>
            <div className="font-display text-3xl font-semibold mt-1">{stock.length}</div>
          </div>
          <div className="glass rounded-2xl p-5">
            <AlertTriangle className="w-5 h-5 text-warning mb-3"/>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Low stock</div>
            <div className="font-display text-3xl font-semibold mt-1">{lowCount}</div>
          </div>
          <div className="glass rounded-2xl p-5">
            <TrendingDown className="w-5 h-5 text-destructive mb-3"/>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Critical</div>
            <div className="font-display text-3xl font-semibold mt-1">{criticalCount}</div>
          </div>
        </motion.div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold mb-5 flex items-center gap-2">
            <Boxes className="w-4 h-4 text-primary"/>
            Live burn-down · {totals.unitsSoldToday} units sold today
          </h3>
          <div className="space-y-3">
            {stock
              .sort((a, b) => {
                const order = { critical: 0, low: 1, ok: 2 };
                return order[a.status] - order[b.status];
              })
              .map((it, i) => {
                const pct = Math.max(0, Math.round((it.remaining / (it.remaining + it.used)) * 100));
                return (
                  <motion.div
                    key={it.ingredientId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="p-4 rounded-xl bg-secondary/30 border border-border/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">{it.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          used {it.used}{it.unit} · {it.remaining}{it.unit} left · par {it.parLevel}{it.unit}
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-md border ${statusColor(it.status)}`}>
                        {it.status}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-background/60 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: i * 0.03 }}
                        className={`h-full rounded-full ${it.status === 'critical' ? 'bg-destructive' : it.status === 'low' ? 'bg-warning' : 'bg-gradient-primary'}`}
                      />
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold mb-3">Restock predictions</h3>
          <p className="text-sm text-muted-foreground mb-5">
            Based on 14-day sales simulation, weekend rush & current burn rate.
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {restockPredictions.length ? restockPredictions.map((r) => (
              <div
                key={r.ingredientId}
                className={`p-4 rounded-xl border ${
                  r.urgency === "high" ? "bg-destructive/5 border-destructive/30" : "bg-primary/5 border-primary/20"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{r.item}</div>
                    <div className="text-xs text-muted-foreground mt-1">{r.reason}</div>
                  </div>
                  <span className="font-mono text-sm text-primary">{r.qty}</span>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground col-span-2">All ingredients above par levels.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
