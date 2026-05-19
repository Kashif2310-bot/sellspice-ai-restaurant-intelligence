import { Topbar } from "@/components/layout/Topbar";
import { topItems, categoryShare } from "@/lib/mockData";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowDownRight, ArrowUpRight, Receipt } from "lucide-react";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(170 90% 55%)', 'hsl(140 70% 45%)', 'hsl(180 50% 40%)'];

export default function Billing() {
  const total = topItems.reduce((s, i) => s + i.revenue, 0);
  const units = topItems.reduce((s, i) => s + i.sold, 0);

  return (
    <div>
      <Topbar title="Live Billing" subtitle="Every item, every rupee — in real time" />
      <div className="px-6 lg:px-10 py-8 space-y-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-5">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Total revenue</div>
            <div className="font-display text-3xl font-semibold mt-2">₹{total.toLocaleString()}</div>
            <div className="text-xs text-primary mt-1 font-mono">LIVE · updating</div>
          </div>
          <div className="glass rounded-2xl p-5">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Units sold</div>
            <div className="font-display text-3xl font-semibold mt-2">{units}</div>
            <div className="text-xs text-muted-foreground mt-1">across 6 categories</div>
          </div>
          <div className="glass rounded-2xl p-5">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Est. profit</div>
            <div className="font-display text-3xl font-semibold mt-2 gradient-text">₹{Math.round(total * 0.34).toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">34.2% margin</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2"><Receipt className="w-4 h-4 text-primary"/>Item-level ledger</h3>
            <div className="space-y-2">
              {topItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 border border-transparent hover:border-primary/20 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-display text-primary font-semibold shrink-0">
                      {item.name[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{item.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">₹{item.price} · per unit</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right">
                      <div className="font-mono text-sm">{item.sold} sold</div>
                      <div className={`text-xs inline-flex items-center gap-0.5 ${item.trend >= 0 ? 'text-primary' : 'text-destructive'}`}>
                        {item.trend >= 0 ? <ArrowUpRight className="w-3 h-3"/> : <ArrowDownRight className="w-3 h-3"/>}
                        {Math.abs(item.trend)}%
                      </div>
                    </div>
                    <div className="text-right min-w-[90px]">
                      <div className="font-display font-semibold">₹{item.revenue.toLocaleString()}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Category share</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={categoryShare} dataKey="value" innerRadius={60} outerRadius={95} paddingAngle={3}>
                  {categoryShare.map((_, i) => <Cell key={i} fill={COLORS[i]} stroke="hsl(var(--background))" strokeWidth={2}/>)}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {categoryShare.map((c, i) => (
                <div key={c.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS[i] }} />
                    {c.name}
                  </div>
                  <span className="font-mono text-muted-foreground">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
