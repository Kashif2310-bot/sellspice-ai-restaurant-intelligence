import { NavLink } from "react-router-dom";
import { LayoutDashboard, Receipt, ScanLine, Boxes, Sparkles, TrendingUp, Radio, Mic } from "lucide-react";
import { motion } from "framer-motion";

const nav = [
  { to: "/app", icon: LayoutDashboard, label: "Overview", end: true },
  { to: "/app/billing", icon: Receipt, label: "Live Billing" },
  { to: "/app/scan", icon: ScanLine, label: "Bill Scanner" },
  { to: "/app/inventory", icon: Boxes, label: "Inventory" },
  { to: "/app/forecast", icon: TrendingUp, label: "Forecast" },
  { to: "/app/social", icon: Radio, label: "Social Feed" },
  { to: "/app/assistant", icon: Sparkles, label: "AI Assistant" },
  { to: "/app/voice", icon: Mic, label: "Voice AI" },
];

export const Sidebar = () => {
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-sidebar-border bg-sidebar/60 backdrop-blur-xl sticky top-0 h-screen">
      <div className="px-6 py-6 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center glow-primary">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <div className="font-display font-bold text-lg leading-none">SELLSPICE</div>
          <div className="text-[10px] tracking-[0.2em] text-primary font-mono">AI · OS</div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-4">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div layoutId="dot" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="m-3 p-4 rounded-xl glass">
        <div className="text-xs text-muted-foreground mb-1">Workspace</div>
        <div className="font-display font-semibold">Spice Garden HQ</div>
        <div className="mt-3 flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-primary">AI active · learning</span>
        </div>
      </div>
    </aside>
  );
};
