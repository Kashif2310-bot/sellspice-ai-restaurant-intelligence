import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  delay?: number;
}

export const StatCard = ({ label, value, change, icon: Icon, delay = 0 }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
    className="glass rounded-2xl p-5 hover:border-primary/30 transition-all group"
  >
    <div className="flex items-start justify-between">
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition">
        <Icon className="w-4 h-4 text-primary" />
      </div>
    </div>
    <div className="mt-3 font-display text-3xl font-semibold tracking-tight">{value}</div>
    {change !== undefined && (
      <div className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${change >= 0 ? 'text-primary' : 'text-destructive'}`}>
        {change >= 0 ? <ArrowUpRight className="w-3 h-3"/> : <ArrowDownRight className="w-3 h-3"/>}
        {Math.abs(change)}% vs yesterday
      </div>
    )}
  </motion.div>
);
