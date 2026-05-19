import { Topbar } from "@/components/layout/Topbar";
import { useRestaurant } from "@/context/RestaurantContext";
import { parseBillImage } from "@/lib/ocrClient";
import { Upload, FileText, Sparkles, CheckCircle2, ArrowRight, Package, BarChart3 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Extracted { name: string; qty: number; price: number }

export default function Scanner() {
  const { processOcrBill, snapshot } = useRestaurant();
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [items, setItems] = useState<Extracted[] | null>(null);
  const [lastBillId, setLastBillId] = useState<string | null>(null);

  const handleFile = async (f: File) => {
    setFile(f);
    setItems(null);
    setLastBillId(null);
    setScanning(true);

    try {
      const parsed = await parseBillImage(f);
      setItems(parsed.items);
      const bill = processOcrBill(
        parsed.items.map((i) => ({
          name: i.name,
          resolvedName: i.name,
          qty: i.qty,
          price: i.price,
          menuItemId: i.menuItemId ?? null,
        }))
      );
      setLastBillId(bill.id);

      const units = parsed.items.reduce((s, i) => s + i.qty, 0);
      toast.success("Bill parsed · system updated", {
        description: `${parsed.items.length} items, ${units} units → billing, inventory & analytics refreshed.`,
      });
    } catch {
      toast.error("Scan failed", { description: "Could not parse bill. Try a clearer image." });
    } finally {
      setScanning(false);
    }
  };

  const subtotal = items?.reduce((s, i) => s + i.qty * i.price, 0) ?? 0;
  const gst = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + gst + 15;

  return (
    <div>
      <Topbar title="Bill Scanner" subtitle="OCR → auto-update billing, inventory & analytics" />
      <motion.div className="px-6 lg:px-10 py-8 grid lg:grid-cols-2 gap-6">
        <label className="glass rounded-2xl p-10 border-dashed border-2 hover:border-primary/40 transition cursor-pointer flex flex-col items-center justify-center text-center min-h-[420px] relative overflow-hidden group">
          <input
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="absolute inset-0 bg-gradient-radial opacity-0 group-hover:opacity-100 transition" />
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 relative">
            <Upload className="w-9 h-9 text-primary" />
            {scanning && <div className="absolute inset-0 rounded-2xl border-2 border-primary animate-pulse-glow" />}
          </div>
          <h3 className="font-display text-xl font-semibold relative">
            {scanning ? "Gemini OCR scanning…" : file ? file.name : "Drop bill image or PDF"}
          </h3>
          <p className="text-sm text-muted-foreground mt-2 relative">
            JPG · PNG · PDF · Truffles receipts
          </p>
          {scanning && (
            <div className="mt-6 w-full max-w-xs h-1.5 rounded-full bg-secondary overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-primary animate-shimmer"
                style={{ backgroundSize: "200% 100%", width: "100%" }}
              />
            </div>
          )}
        </label>

        <div className="glass rounded-2xl p-6 min-h-[420px] flex flex-col">
          <motion.div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-display text-lg font-semibold">Extracted items</h3>
          </motion.div>
          <AnimatePresence mode="wait">
            {!items && !scanning && (
              <motion.div
                key="empty"
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-sm"
              >
                <FileText className="w-10 h-10 mb-3 opacity-40" />
                Upload a Truffles receipt to extract line items and auto-update the system.
              </motion.div>
            )}
            {items && (
              <motion.div
                key="items"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col"
              >
                <div className="space-y-2 flex-1">
                  {items.map((it, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/40 border border-primary/10"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <div>
                          <div className="font-medium text-sm">{it.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            qty {it.qty} × ₹{it.price}
                          </div>
                        </div>
                      </div>
                      <motion.div className="font-display font-semibold">
                        ₹{(it.qty * it.price).toLocaleString()}
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-mono">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>GST (5%)</span>
                    <span className="font-mono">₹{gst.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Packaging</span>
                    <span className="font-mono">₹15</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/30">
                    <span className="text-sm text-muted-foreground">Bill total</span>
                    <span className="font-display text-2xl font-semibold gradient-text">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {lastBillId && (
                  <div className="mt-4 p-4 rounded-xl bg-accent/5 border border-accent/20">
                    <div className="text-xs text-muted-foreground mb-2">Auto-updated</div>
                    <div className="grid grid-cols-3 gap-2 text-[10px]">
                      <div className="flex items-center gap-1 text-primary">
                        <BarChart3 className="w-3 h-3" /> Analytics
                      </div>
                      <div className="flex items-center gap-1 text-primary">
                        <Package className="w-3 h-3" /> Inventory
                      </div>
                      <div className="flex items-center gap-1 text-primary">
                        <CheckCircle2 className="w-3 h-3" /> {lastBillId}
                      </div>
                    </div>
                    <Link
                      to="/app/billing"
                      className="mt-3 flex items-center justify-center gap-1 text-xs text-primary hover:underline"
                    >
                      View in Billing Intelligence <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="px-6 lg:px-10 pb-8">
        <div className="glass rounded-2xl p-5 grid md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-display font-semibold text-primary">
              {snapshot.totals.ordersToday}
            </div>
            <div className="text-xs text-muted-foreground">Orders today (incl. OCR)</div>
          </div>
          <div>
            <div className="text-2xl font-display font-semibold">
              ₹{snapshot.totals.revenueToday.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Revenue today</div>
          </div>
          <div>
            <div className="text-2xl font-display font-semibold">
              {snapshot.stock.filter((s) => s.status !== "ok").length}
            </div>
            <div className="text-xs text-muted-foreground">Stock alerts active</div>
          </div>
        </div>
      </div>
    </div>
  );
}
