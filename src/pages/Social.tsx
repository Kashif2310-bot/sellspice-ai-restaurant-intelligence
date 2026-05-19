import { Topbar } from "@/components/layout/Topbar";
import { socialIdeas } from "@/lib/socialContent";
import { Flame, Heart, Share2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const tagColor = (t: string) => t === "Reels" ? "bg-primary/15 text-primary" : t === "TikTok" ? "bg-accent/15 text-accent" : t === "Story" ? "bg-warning/15 text-warning" : "bg-secondary text-muted-foreground";
const engColor = (e: string) => e === "Viral" ? "text-destructive" : e === "High" ? "text-primary" : "text-muted-foreground";

export default function Social() {
  return (
    <div>
      <Topbar title="Social Growth Feed" subtitle="AI-generated ideas tuned to your restaurant" />
      <div className="px-6 lg:px-10 py-8">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {socialIdeas.map((idea, i) => (
            <motion.div
              key={idea.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass rounded-2xl p-5 hover:border-primary/30 transition group flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-md ${tagColor(idea.tag)}`}>{idea.tag}</span>
                <span className={`inline-flex items-center gap-1 text-xs ${engColor(idea.engagement)}`}>
                  <Flame className="w-3 h-3"/>{idea.engagement}
                </span>
              </div>
              <div className="aspect-[4/5] rounded-xl bg-gradient-to-br from-primary/20 via-accent/10 to-background flex items-center justify-center mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
                <Sparkles className="w-10 h-10 text-primary/70 relative z-10" />
              </div>
              <h3 className="font-display font-semibold leading-tight">{idea.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 italic">"{idea.hook}"</p>
              <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50 mt-4">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Heart className="w-3 h-3"/> {Math.floor(Math.random()*800+200)}</span>
                  <span className="inline-flex items-center gap-1"><Share2 className="w-3 h-3"/> {Math.floor(Math.random()*80+10)}</span>
                </div>
                <button className="text-xs px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition">Generate post</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
