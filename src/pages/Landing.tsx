import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, TrendingUp, Brain, Receipt, Boxes, Radio, Zap } from "lucide-react";

const features = [
  { icon: Brain, title: "AI Business Brain", desc: "Personalized strategies based on location, events, weather & history." },
  { icon: Receipt, title: "Live Billing OS", desc: "Real-time item tracking, revenue & profit pulse." },
  { icon: Boxes, title: "Inventory Autopilot", desc: "Ingredient-level burn down & restock predictions." },
  { icon: TrendingUp, title: "Demand Forecast", desc: "Tomorrow's sales, peak hours and trending dishes." },
  { icon: Radio, title: "Social Growth Feed", desc: "AI-generated reels & campaign ideas, daily." },
  { icon: Zap, title: "Bill Scanner", desc: "Snap a receipt — OCR auto-updates your analytics." },
];

export default function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden grid-bg">
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center glow-primary">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-display font-bold text-lg leading-none">SELLSPICE</div>
            <div className="text-[10px] tracking-[0.2em] text-primary font-mono">AI · OS</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <a href="#features" className="hover:text-foreground transition">Pricing</a>
          <a href="#features" className="hover:text-foreground transition">Docs</a>
        </div>
        <Link to="/app" className="px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition glow-primary">
          Launch app
        </Link>
      </nav>

      <section className="relative z-10 px-6 lg:px-12 pt-16 pb-32 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-primary mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
            Autonomous restaurant intelligence
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95]">
            The AI brain
            <br/>
            <span className="gradient-text">behind profitable</span>
            <br/>
            restaurants.
          </h1>
          <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Predict demand. Cut waste. Push the right combo at the right hour.
            SELLSPICE AI runs your numbers so you run your kitchen.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link to="/app" className="group px-6 py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold inline-flex items-center gap-2 glow-primary hover:scale-[1.02] transition">
              Open dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </Link>
            <button className="px-6 py-3.5 rounded-xl glass font-medium">Watch 2-min demo</button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative mt-20"
        >
          <div className="glass-strong rounded-3xl p-2 max-w-5xl mx-auto">
            <div className="rounded-2xl bg-background/60 p-8 lg:p-12">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="font-display text-4xl lg:text-5xl font-bold gradient-text">+38%</div>
                  <div className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">Avg profit lift</div>
                </div>
                <div>
                  <div className="font-display text-4xl lg:text-5xl font-bold gradient-text">-27%</div>
                  <div className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">Food wastage</div>
                </div>
                <div>
                  <div className="font-display text-4xl lg:text-5xl font-bold gradient-text">12s</div>
                  <div className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">Bill to insight</div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </motion.div>
      </section>

      <section id="features" className="relative z-10 px-6 lg:px-12 pb-32 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">Every lever, automated.</h2>
          <p className="mt-3 text-muted-foreground">One OS for the entire profit loop.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-6 hover:border-primary/30 transition group"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-1.5">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-border/40 px-6 lg:px-12 py-8 text-center text-xs text-muted-foreground">
        © 2026 SELLSPICE AI — Built for restaurants that scale.
      </footer>
    </div>
  );
}
