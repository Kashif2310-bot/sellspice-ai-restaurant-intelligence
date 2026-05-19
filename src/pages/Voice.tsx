import { Topbar } from "@/components/layout/Topbar";
import { Mic, Radio } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Voice() {
  const [listening, setListening] = useState(false);
  return (
    <div>
      <Topbar title="Voice AI" subtitle="Hands-free, real-time conversation with your restaurant brain" />
      <div className="px-6 lg:px-10 py-16 flex flex-col items-center text-center">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {listening && (
            <>
              <motion.div className="absolute inset-0 rounded-full border border-primary/40" animate={{ scale: [1, 1.5], opacity: [0.6, 0] }} transition={{ duration: 2, repeat: Infinity }}/>
              <motion.div className="absolute inset-0 rounded-full border border-primary/40" animate={{ scale: [1, 1.8], opacity: [0.4, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}/>
              <motion.div className="absolute inset-0 rounded-full border border-primary/40" animate={{ scale: [1, 2.1], opacity: [0.3, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}/>
            </>
          )}
          <button
            onClick={() => setListening((l) => !l)}
            className={`relative w-44 h-44 rounded-full bg-gradient-primary flex items-center justify-center transition-all ${listening ? 'glow-primary animate-pulse-glow' : ''}`}
          >
            <Mic className="w-14 h-14 text-primary-foreground"/>
          </button>
        </div>
        <h2 className="font-display text-3xl font-semibold mt-12">
          {listening ? "Listening…" : "Tap to speak"}
        </h2>
        <p className="text-muted-foreground mt-3 max-w-md">
          {listening ? "I'm here. Ask me about sales, stock, strategies, or anything else." : "Try: \"How much did I make today?\" or \"What should I push tomorrow evening?\""}
        </p>

        <div className="mt-16 grid md:grid-cols-3 gap-4 w-full max-w-3xl">
          {["\"Hey Sellspice, sales today?\"", "\"What's low in stock?\"", "\"Best combo for tomorrow?\""].map((q) => (
            <div key={q} className="glass rounded-xl p-4 text-sm text-muted-foreground flex items-center gap-2">
              <Radio className="w-4 h-4 text-primary shrink-0"/> {q}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
