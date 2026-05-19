import { Bell, Search, Command } from "lucide-react";

export const Topbar = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <header className="flex items-center justify-between px-6 lg:px-10 py-6 border-b border-border/40">
    <div>
      <h1 className="font-display text-2xl lg:text-3xl font-semibold tracking-tight">{title}</h1>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
    <div className="flex items-center gap-3">
      <div className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-lg glass text-sm text-muted-foreground min-w-[260px]">
        <Search className="w-4 h-4" />
        <span>Ask anything…</span>
        <kbd className="ml-auto flex items-center gap-1 text-[10px] font-mono"><Command className="w-3 h-3"/>K</kbd>
      </div>
      <button className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:border-primary/30 transition">
        <Bell className="w-4 h-4" />
      </button>
      <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center font-display font-bold text-primary-foreground">
        S
      </div>
    </div>
  </header>
);
