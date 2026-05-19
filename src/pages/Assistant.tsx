import { Topbar } from "@/components/layout/Topbar";
import { motion } from "framer-motion";
import { Send, Sparkles, User } from "lucide-react";
import { useState } from "react";

interface Msg { role: "user" | "ai"; text: string }

const seed: Msg[] = [
  { role: "ai", text: "Good evening 🌒 I've already scanned today's sales, weather, local events and inventory. Ask me anything — or try one of the prompts below." },
];

const suggestions = [
  "What strategy should I use tomorrow to maximize profits?",
  "Why did sales drop after 3 PM today?",
  "What combo should I push tomorrow evening?",
  "Which dishes should I retire this week?",
];

const fakeResponse = (q: string) => {
  if (/profit|strategy|tomorrow/i.test(q)) return "Tomorrow forecast: rain after 6 PM + a college fest 0.4km away. Expect a 35% bump in 18–24 age footfall between 5–8 PM.\n\nStrategy:\n• Promote a ₹199 Cold Coffee + Fries combo on Instagram story by 2 PM.\n• Pre-prep 200 burger patties (current stock is critical).\n• Staff one extra runner from 6–9 PM.\n\nProjected lift: +₹13,600 revenue · +₹4,800 profit.";
  if (/drop|why/i.test(q)) return "Sales dipped 22% between 3–5 PM. Three likely drivers:\n• A nearby competitor ran a 'buy 1 get 1' on burgers at 2:45 PM.\n• Your delivery partner reported a 14-min average delay.\n• Cold coffee was out of stock from 3:18 PM.\n\nRecommendation: re-stock cold coffee immediately and run a flash 15%-off story for the next 90 mins.";
  if (/combo|push/i.test(q)) return "Push the 'Rainy Combo': Veg Pasta + Cold Coffee at ₹329 (margin 41%). Pasta orders historically jump 42% during evening rain, and cold coffee has the highest attach rate in your data.";
  return "Based on the last 30 days, retire Paneer Tikka from the weekday menu (sales down 4% w/w, wastage up 9%). Keep it weekends-only and rotate in a Tandoori Wrap — your demographic ordered similar items 3× more often.";
};

export default function Assistant() {
  const [msgs, setMsgs] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "ai", text: fakeResponse(text) }]);
      setTyping(false);
    }, 900);
  };

  return (
    <div className="flex flex-col h-screen">
      <Topbar title="AI Assistant" subtitle="Your restaurant's strategic co-pilot" />
      <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {msgs.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-secondary' : 'bg-gradient-primary glow-primary'}`}>
                {m.role === 'user' ? <User className="w-4 h-4"/> : <Sparkles className="w-4 h-4 text-primary-foreground"/>}
              </div>
              <div className={`max-w-[80%] ${m.role === 'user' ? 'glass-strong' : ''} rounded-2xl ${m.role === 'user' ? 'px-4 py-3' : 'py-1'}`}>
                <div className="whitespace-pre-wrap leading-relaxed text-[15px]">{m.text}</div>
              </div>
            </motion.div>
          ))}
          {typing && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center glow-primary">
                <Sparkles className="w-4 h-4 text-primary-foreground"/>
              </div>
              <div className="flex items-center gap-1 pt-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"/>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.15s' }}/>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.3s' }}/>
              </div>
            </div>
          )}
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
              placeholder="Ask anything about your restaurant…"
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <button type="submit" disabled={!input.trim()} className="w-10 h-10 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 transition glow-primary">
              <Send className="w-4 h-4"/>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
