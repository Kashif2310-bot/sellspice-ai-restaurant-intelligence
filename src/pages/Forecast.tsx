import { Topbar } from "@/components/layout/Topbar";
import { forecast } from "@/lib/mockData";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Cloud, Calendar, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Forecast() {
  return (
    <div>
      <Topbar title="Forecast" subtitle="Tomorrow, modeled · powered by AI" />
      <div className="px-6 lg:px-10 py-8 space-y-8">
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { icon: TrendingUp, label: "Predicted revenue", value: "₹21,400", note: "tomorrow" },
            { icon: Users, label: "Expected footfall", value: "512", note: "+18% vs avg" },
            { icon: Cloud, label: "Weather", value: "26°C · Rain", note: "evening" },
            { icon: Calendar, label: "Local event", value: "College fest", note: "0.4km away" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-2xl p-5">
              <s.icon className="w-5 h-5 text-primary mb-3"/>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</div>
              <div className="font-display text-2xl font-semibold mt-1">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.note}</div>
            </motion.div>
          ))}
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold mb-4">7-day revenue forecast</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={forecast}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false}/>
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12}/>
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12}/>
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}/>
              <Legend wrapperStyle={{ fontSize: 12 }}/>
              <Line type="monotone" dataKey="actual" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} name="Actual"/>
              <Line type="monotone" dataKey="predicted" stroke="hsl(var(--accent))" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 4 }} name="AI Predicted"/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Predicted rush windows</h3>
            <div className="space-y-3">
              {[
                { window: "1:00 PM – 2:30 PM", load: 78, label: "Lunch peak" },
                { window: "6:30 PM – 8:30 PM", load: 94, label: "Dinner surge" },
                { window: "10:00 PM – 11:00 PM", load: 52, label: "Late night" },
              ].map((r) => (
                <div key={r.window} className="p-4 rounded-xl bg-secondary/30">
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="font-medium">{r.label}</span>
                    <span className="font-mono text-muted-foreground">{r.window}</span>
                  </div>
                  <div className="h-2 rounded-full bg-background/60 overflow-hidden">
                    <div className="h-full bg-gradient-primary" style={{ width: `${r.load}%` }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Trending tomorrow</h3>
            <div className="space-y-2">
              {[
                { dish: "Cold Coffee", reason: "Heat + students", lift: "+34%" },
                { dish: "Veg Pasta", reason: "Rain forecast", lift: "+42%" },
                { dish: "Margherita Pizza", reason: "Group orders", lift: "+19%" },
                { dish: "Cheese Garlic Bread", reason: "Combo upsell", lift: "+15%" },
              ].map((t) => (
                <div key={t.dish} className="flex justify-between items-center p-3 rounded-lg hover:bg-secondary/30 transition">
                  <div>
                    <div className="font-medium text-sm">{t.dish}</div>
                    <div className="text-xs text-muted-foreground">{t.reason}</div>
                  </div>
                  <span className="font-mono text-primary text-sm">{t.lift}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
