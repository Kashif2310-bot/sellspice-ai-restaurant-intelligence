import { Topbar } from "@/components/layout/Topbar";
import { Upload, FileText, Sparkles, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Extracted { name: string; qty: number; price: number }

export default function Scanner() {
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [items, setItems] = useState<Extracted[] | null>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setItems(null);
    setScanning(true);
    setTimeout(() => {
      setItems([
        { name: "Margherita Pizza", qty: 2, price: 300 },
        { name: "Classic Burger", qty: 5, price: 180 },
        { name: "Cold Coffee", qty: 3, price: 120 },
        { name: "French Fries", qty: 4, price: 100 },
      ]);
      setScanning(false);
      toast.success("Bill parsed · analytics updated", { description: "4 items, 14 units logged to billing tracker." });
    }, 1800);
  };

  const total = items?.reduce((s, i) => s + i.qty * i.price, 0) ?? 0;

  return (
    <div>
      <Topbar title="Bill Scanner" subtitle="Drop a receipt — AI OCR does the rest" />
      <div className="px-6 lg:px-10 py-8 grid lg:grid-cols-2 gap-6">
        <label className="glass rounded-2xl p-10 border-dashed border-2 hover:border-primary/40 transition cursor-pointer flex flex-col items-center justify-center text-center min-h-[420px] relative overflow-hidden group">
          <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <div className="absolute inset-0 bg-gradient-radial opacity-0 group-hover:opacity-100 transition" />
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 relative">
            <Upload className="w-9 h-9 text-primary" />
            {scanning && <div className="absolute inset-0 rounded-2xl border-2 border-primary animate-pulse-glow" />}
          </div>
          <h3 className="font-display text-xl font-semibold relative">
            {scanning ? "Scanning…" : file ? file.name : "Drop bill image or PDF"}
          </h3>
          <p className="text-sm text-muted-foreground mt-2 relative">
            JPG · PNG · PDF · up to 10MB
          </p>
          {scanning && (
            <div className="mt-6 w-full max-w-xs h-1.5 rounded-full bg-secondary overflow-hidden relative">
              <div className="h-full bg-gradient-primary animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
            </div>
          )}
        </label>

        <div className="glass rounded-2xl p-6 min-h-[420px]">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-display text-lg font-semibold">Extracted items</h3>
          </div>
          <AnimatePresence mode="wait">
            {!items && !scanning && (
              <motion.div key="empty" exit={{ opacity: 0 }} className="text-center py-16 text-muted-foreground text-sm">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
                Upload a bill to see parsed line items here.
              </motion.div>
            )}
            {items && (
              <motion.div key="items" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="space-y-2">
                  {items.map((it, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/40 border border-primary/10">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <div>
                          <div className="font-medium text-sm">{it.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">qty {it.qty} × ₹{it.price}</div>
                        </div>
                      </div>
                      <div className="font-display font-semibold">₹{(it.qty * it.price).toLocaleString()}</div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/30">
                  <span className="text-sm text-muted-foreground">Bill total</span>
                  <span className="font-display text-2xl font-semibold gradient-text">₹{total.toLocaleString()}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
