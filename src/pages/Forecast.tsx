import { Topbar } from "@/components/layout/Topbar";
import { useRestaurant } from "@/context/RestaurantContext";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Cloud, Calendar, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Forecast() {
  const { snapshot } = useRestaurant();
  const { forecast, topItems, totals } = snapshot;

  const tomorrow = forecast[forecast.length - 1];
  const predictedTomorrow = tomorrow?.predicted ?? Math.round(totals.revenueWeek / 7 * 1.1);

  return (
    <div>
      <Topbar title="Demand Forecast" subtitle="14-day model · weekend & student crowd patterns" />
      <div className="px-6 lg:px-10 py-8 space-y-8">
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { icon: TrendingUp, label: "Predicted tomorrow", value: `₹${predictedTomorrow.toLocaleString()}`, note: tomorrow?.isWeekend ? "weekend surge" : "weekday" },
            { icon: Users, label: "Expected orders", value: Math.round(predictedTomorrow / totals.avgTicket).toString(), note: `avg ₹${totals.avgTicket} ticket` },
            { icon: Cloud, label: "Peak window", value: "7–9 PM", note: "dinner rush" },
            { icon: Calendar, label: "Local driver", value: "MS Ramaiah", note: "student footfall 5–10 PM" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-2xl p-5">
              <s.icon className="w-5 h-5 text-primary mb-3"/>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</div>
              <div className="font-display text-2xl font-semibold mt-1">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.note}</div>
            </motion.div>
          ))}
        </div>

        <motion.div className="glass rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold mb-4">7-day revenue forecast</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={forecast}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false}/>
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12}/>
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12}/>
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} formatter={(v: number) => [`₹${v?.toLocaleString()}`, '']} />
              <Legend wrapperStyle={{ fontSize: 12 }}/>
              <Line type="monotone" dataKey="actual" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} name="Actual" connectNulls={false} />
              <Line type="monotone" dataKey="predicted" stroke="hsl(var(--accent))" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 4 }} name="AI Predicted"/>
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Predicted rush windows</h3>
            <div className="space-y-3">
              {[
                { window: "12:30 PM – 2:30 PM", load: 72, label: "Office lunch · BEL Road" },
                { window: "5:00 PM – 7:00 PM", load: 85, label: "Student pre-rush · Ramaiah" },
                { window: "7:30 PM – 9:30 PM", load: 96, label: "Dinner peak · burgers & shakes" },
                { window: "10:00 PM – 11:00 PM", load: 48, label: "Late night desserts" },
              ].map((r) => (
                <div key={r.window} className="p-4 rounded-xl bg-secondary/30">
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="font-medium">{r.label}</span>
                    <span className="font-mono text-muted-foreground">{r.window}</span>
                  </div>
                  <div className="h-2 rounded-full bg-background/60 overflow-hidden">
                    <motion.div className="h-full bg-gradient-primary" style={{ width: `${r.load}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Trending tomorrow</h3>
            <div className="space-y-2">
              {topItems.slice(0, 5).map((t) => (
                <div key={t.menuItemId} className="flex justify-between items-center p-3 rounded-lg hover:bg-secondary/30 transition">
                  <motion.div>
                    <div className="font-medium text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.category} · ₹{t.price}</div>
                  </motion.div>
                  <span className="font-mono text-primary text-sm">+{t.trend}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
