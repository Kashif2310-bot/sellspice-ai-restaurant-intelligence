import { Topbar } from "@/components/layout/Topbar";
import { motion } from "framer-motion";
import { Send, Sparkles, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Msg { role: "user" | "assistant"; content: string }

const seed: Msg[] = [
  { role: "assistant", content: "Good evening 🌒 I've scanned Truffles' sales, weather, MS Ramaiah footfall and inventory. Ask me anything — or try a prompt below." },
];

const suggestions = [
  "What strategy should I run tomorrow to maximize profits?",
  "Why did sales dip after 3 PM today?",
  "Best combo to push tonight at Truffles?",
  "Which dishes should I retire this week?",
];

export default function Assistant() {
  const [msgs, setMsgs] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

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
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error || "AI request failed");
      }

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
          } catch { /* ignore parse */ }
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
    <div className="flex flex-col h-screen">
      <Topbar title="AI Assistant" subtitle="Truffles' strategic co-pilot · powered by Gemini" />
      <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {msgs.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-secondary' : 'bg-gradient-primary glow-primary'}`}>
                {m.role === 'user' ? <User className="w-4 h-4"/> : <Sparkles className="w-4 h-4 text-primary-foreground"/>}
              </div>
              <div className={`max-w-[80%] ${m.role === 'user' ? 'glass-strong px-4 py-3' : 'py-1'} rounded-2xl`}>
                <div className="whitespace-pre-wrap leading-relaxed text-[15px]">
                  {m.content || (streaming && i === msgs.length - 1 ? (
                    <span className="inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"/>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.15s' }}/>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.3s' }}/>
                    </span>
                  ) : null)}
                </div>
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
