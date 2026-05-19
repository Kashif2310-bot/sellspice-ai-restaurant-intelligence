import { Topbar } from "@/components/layout/Topbar";
import { useRestaurant } from "@/context/RestaurantContext";
import { getLiveContextForAI } from "@/lib/restaurantStore";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, User, Brain, Cloud, Plus, X, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Msg { role: "user" | "assistant"; content: string }

const seed: Msg[] = [
  { role: "assistant", content: "**Good evening 🌒 I'm SELLSPICE AI — your autonomous strategist for Truffles · Sanjaynagar.**\n\nI've already pulled today's weather around 80FT Road, MS Ramaiah footfall windows, your inventory pressure, and live sales velocity. Ask me anything — or try a prompt below." },
];

const suggestions = [
  "What strategy should I run tomorrow to maximize profits?",
  "Why did sales dip after 3 PM today?",
  "Best combo to push tonight given the weather?",
  "Which dishes should I retire this week?",
  "How do I exploit the MS Ramaiah crowd this weekend?",
];

const THINK_STEPS = [
  { icon: Cloud, label: "Pulling live weather for Sanjaynagar…" },
  { icon: Brain, label: "Cross-referencing sales + inventory…" },
  { icon: Zap, label: "Scanning nearby demand drivers…" },
  { icon: Sparkles, label: "Composing strategy…" },
];

const MEM_KEY = "sellspice:memory:v1";

export default function Assistant() {
  const { snapshot } = useRestaurant();
  const [msgs, setMsgs] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [thinkStep, setThinkStep] = useState(0);
  const [memory, setMemory] = useState<string[]>([]);
  const [showMemory, setShowMemory] = useState(false);
  const [newMem, setNewMem] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(MEM_KEY);
      if (raw) setMemory(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, streaming]);

  useEffect(() => {
    if (!streaming) return;
    setThinkStep(0);
    const id = setInterval(() => setThinkStep((s) => (s + 1) % THINK_STEPS.length), 900);
    return () => clearInterval(id);
  }, [streaming]);

  const persistMemory = (next: string[]) => {
    setMemory(next);
    try { localStorage.setItem(MEM_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const addMemory = (m: string) => {
    const t = m.trim();
    if (!t) return;
    if (memory.includes(t)) return;
    persistMemory([...memory, t].slice(-20));
  };

  const send = async (text: string) => {
    if (!text.trim() || streaming) return;
    const next: Msg[] = [...msgs, { role: "user", content: text }];
    setMsgs(next);
    setInput("");
    setStreaming(true);
    setMsgs((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const url = `https://zxwzfdzmtuoqupbbuecl.supabase.co/functions/v1/ai-assistant`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map(({ role, content }) => ({ role, content })),
          memory,
          liveContext: getLiveContextForAI(snapshot),
        }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error || "AI request failed");
      }

      // Capture auto-extracted memory from server
      try {
        const memHeader = res.headers.get("X-Sellspice-New-Memory");
        if (memHeader) {
          const auto: string[] = JSON.parse(decodeURIComponent(memHeader));
          if (auto.length) {
            const merged = [...memory];
            auto.forEach((m) => { if (!merged.includes(m)) merged.push(m); });
            persistMemory(merged.slice(-20));
          }
        }
      } catch { /* ignore */ }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              acc += delta;
              setMsgs((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: acc };
                return copy;
              });
            }
          } catch { /* ignore */ }
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      toast.error(msg);
      setMsgs((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: `⚠️ ${msg}` };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="flex flex-col h-screen relative">
      <Topbar title="AI Strategist" subtitle="Live weather · sales · inventory · footfall — fused in real time" />

      {/* Floating glowing orb */}
      <div className="absolute top-24 right-8 lg:right-12 pointer-events-none z-10">
        <div className="relative">
          <motion.div
            animate={{ scale: streaming ? [1, 1.15, 1] : [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: streaming ? 1.2 : 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 rounded-full bg-gradient-primary blur-2xl"
          />
          <div className="absolute inset-0 w-16 h-16 rounded-full bg-gradient-primary opacity-80 flex items-center justify-center">
            <Brain className="w-7 h-7 text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Memory pill */}
      <div className="px-6 lg:px-10 pt-4">
        <div className="max-w-3xl mx-auto flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowMemory((s) => !s)}
            className="text-xs px-3 py-1.5 rounded-full glass border-primary/30 hover:border-primary/60 transition flex items-center gap-1.5"
          >
            <Brain className="w-3 h-3 text-primary" />
            <span className="font-mono">{memory.length} memories</span>
          </button>
          {memory.slice(-3).map((m, i) => (
            <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-muted-foreground truncate max-w-[220px]">
              {m}
            </span>
          ))}
        </div>

        <AnimatePresence>
          {showMemory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-3xl mx-auto mt-3 glass-strong rounded-2xl p-4 overflow-hidden"
            >
              <div className="text-xs text-muted-foreground mb-2 font-mono uppercase tracking-wider">AI Memory · always injected into every response</div>
              <div className="space-y-1.5 mb-3">
                {memory.length === 0 && <div className="text-sm text-muted-foreground italic">No memories yet. Tell the AI things like "college fest on Friday" or "new supplier for beef patties".</div>}
                {memory.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm group">
                    <span className="w-1 h-1 rounded-full bg-primary"/>
                    <span className="flex-1">{m}</span>
                    <button onClick={() => persistMemory(memory.filter((_, j) => j !== i))} className="opacity-0 group-hover:opacity-100 transition">
                      <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive"/>
                    </button>
                  </div>
                ))}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); addMemory(newMem); setNewMem(""); }} className="flex gap-2">
                <input
                  value={newMem}
                  onChange={(e) => setNewMem(e.target.value)}
                  placeholder="Add context the AI should remember…"
                  className="flex-1 bg-secondary/40 border border-border/60 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/50"
                />
                <button type="submit" className="px-3 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5"/> Save
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Conversation */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 lg:px-10 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {msgs.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-secondary' : 'bg-gradient-primary glow-primary'}`}>
                {m.role === 'user' ? <User className="w-4 h-4"/> : <Sparkles className="w-4 h-4 text-primary-foreground"/>}
              </div>
              <div className={`max-w-[80%] ${m.role === 'user' ? 'glass-strong px-4 py-3' : 'py-1'} rounded-2xl`}>
                {!m.content && streaming && i === msgs.length - 1 ? (
                  <ThinkingTrail step={thinkStep} />
                ) : (
                  <FormattedMessage content={m.content} />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="border-t border-border/40 px-6 lg:px-10 py-5">
        <div className="max-w-3xl mx-auto">
          {msgs.length <= 1 && (
            <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
              {suggestions.map((s) => (
                <button key={s} onClick={() => send(s)} className="shrink-0 text-xs px-3 py-2 rounded-lg glass hover:border-primary/30 transition text-muted-foreground hover:text-foreground">
                  {s}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2 glass-strong rounded-2xl p-2 pl-5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about Truffles…"
              className="flex-1 bg-transparent outline-none text-sm"
              disabled={streaming}
            />
            <button type="submit" disabled={!input.trim() || streaming} className="w-10 h-10 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 transition glow-primary">
              <Send className="w-4 h-4"/>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ThinkingTrail({ step }: { step: number }) {
  const Item = THINK_STEPS[step];
  const Icon = Item.icon;
  return (
    <div className="flex items-center gap-3">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-primary" />
        </div>
        <span>{Item.label}</span>
        <span className="inline-flex gap-1 ml-1">
          <span className="w-1 h-1 rounded-full bg-primary animate-pulse"/>
          <span className="w-1 h-1 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.15s' }}/>
          <span className="w-1 h-1 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.3s' }}/>
        </span>
      </motion.div>
    </div>
  );
}

// Lightweight markdown: **bold**, bullets, line breaks
function FormattedMessage({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="whitespace-pre-wrap leading-relaxed text-[15px] space-y-1">
      {lines.map((ln, i) => {
        const trimmed = ln.trim();
        if (trimmed.startsWith("• ") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0"/>
              <span dangerouslySetInnerHTML={{ __html: inlineFormat(trimmed.slice(2)) }} />
            </div>
          );
        }
        return <div key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(ln) }} />;
      })}
    </div>
  );
}

function inlineFormat(s: string): string {
  const esc = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return esc
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="font-mono text-primary text-[13px] px-1 rounded bg-primary/10">$1</code>');
}
