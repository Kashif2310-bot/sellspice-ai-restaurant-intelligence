import { Topbar } from "@/components/layout/Topbar";
import { StatCard } from "@/components/StatCard";
import { DollarSign, ShoppingBag, TrendingUp, Users, AlertTriangle, Sparkles } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, BarChart, Bar, Cell } from "recharts";
import { useRestaurant } from "@/context/RestaurantContext";
import { motion } from "framer-motion";

const insightColor = (t: string) => t === "warning" ? "text-warning border-warning/30 bg-warning/5" : t === "opportunity" ? "text-primary border-primary/30 bg-primary/5" : "text-accent border-accent/30 bg-accent/5";

export default function Dashboard() {
  const { snapshot } = useRestaurant();
  const { hourlySales, topItems, aiInsights, totals, restaurant } = snapshot;

  const todayLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const displayRevenue = totals.revenueToday > 0 ? totals.revenueToday : 12840;
  const displayOrders = totals.ordersToday > 0 ? totals.ordersToday : 146;
  const revenueChange = totals.ordersToday > 300 ? 12 : 8;

  return (
    <div>
      <Topbar title="Overview" subtitle={`${todayLabel} · ${restaurant.location} · Live`} />
      <motion.div className="px-6 lg:px-10 py-8 space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Revenue today" value={`₹${displayRevenue.toLocaleString()}`} change={revenueChange} icon={DollarSign} delay={0} />
          <StatCard label="Orders" value={displayOrders.toString()} change={8} icon={ShoppingBag} delay={0.05} />
          <StatCard label="Avg ticket" value={`₹${totals.avgTicket}`} change={-3} icon={Users} delay={0.1} />
          <StatCard label="Profit margin" value={`${totals.profitMargin.toFixed(1)}%`} change={5} icon={TrendingUp} delay={0.15} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-lg font-semibold">Today's revenue pulse</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Hour-by-hour · Truffles Sanjaynagar peak patterns</p>
              </div>
              <motion.div className="flex gap-2 text-xs">
                <span className="px-2 py-1 rounded-md bg-primary/10 text-primary font-mono">SALES</span>
                <span className="px-2 py-1 rounded-md bg-accent/10 text-accent font-mono">PROFIT</span>
              </motion.div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={hourlySales}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5}/>
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.4}/>
                    <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#g1)" />
                <Area type="monotone" dataKey="profit" stroke="hsl(var(--accent))" strokeWidth={2.5} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="font-display text-lg font-semibold">AI insights</h3>
            </div>
            <div className="space-y-3">
              {aiInsights.map((ins) => (
                <div key={ins.title} className={`p-3.5 rounded-xl border ${insightColor(ins.type)}`}>
                  <motion.div className="flex items-start gap-2">
                    {ins.type === 'warning' && <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />}
                    {ins.type === 'opportunity' && <TrendingUp className="w-4 h-4 mt-0.5 shrink-0" />}
                    {ins.type === 'insight' && <Sparkles className="w-4 h-4 mt-0.5 shrink-0" />}
                    <div className="min-w-0">
                      <div className="font-medium text-sm text-foreground">{ins.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{ins.detail}</div>
                      <div className="text-[10px] font-mono mt-2 opacity-80">{ins.impact}</div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-lg font-semibold">Top movers today</h3>
              <p className="text-xs text-muted-foreground mt-0.5">From {totals.ordersToday} live transactions</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topItems.slice(0, 6)} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={10} width={140} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
              <Bar dataKey="sold" radius={[0, 8, 8, 0]}>
                {topItems.slice(0, 6).map((_, i) => <Cell key={i} fill={i === 0 ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.45)'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>
    </div>
  );
}
