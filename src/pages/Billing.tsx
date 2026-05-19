import { Topbar } from "@/components/layout/Topbar";
import { useRestaurant } from "@/context/RestaurantContext";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  Receipt, Search, Filter, CreditCard, Smartphone, Banknote,
  Utensils, ShoppingBag, Truck, GraduationCap, ScanLine, ChevronDown,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Bill, OrderSource, PaymentMethod } from "@/lib/types";
import { searchBills } from "@/lib/billingSearch";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(170 90% 55%)', 'hsl(140 70% 45%)', 'hsl(180 50% 40%)', 'hsl(200 60% 50%)'];

const paymentIcon: Record<PaymentMethod, typeof CreditCard> = {
  upi: Smartphone,
  card: CreditCard,
  cash: Banknote,
  swiggy: Truck,
  zomato: Truck,
};

const sourceIcon: Record<OrderSource, typeof Utensils> = {
  "dine-in": Utensils,
  takeaway: ShoppingBag,
  delivery: Truck,
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

function BillRow({ bill, expanded, onToggle }: { bill: Bill; expanded: boolean; onToggle: () => void }) {
  const PayIcon = paymentIcon[bill.paymentMethod] ?? CreditCard;
  const SrcIcon = sourceIcon[bill.source] ?? Utensils;

  return (
    <motion.div
      layout
      className="rounded-xl border border-border/50 bg-secondary/20 hover:border-primary/25 transition overflow-hidden"
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 text-left"
      >
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          className="shrink-0 text-muted-foreground"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
        <motion.div
          className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"
        >
          <Receipt className="w-4 h-4 text-primary" />
        </motion.div>
        <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-5 gap-2">
          <motion.div>
            <div className="font-mono text-xs text-primary">{bill.id}</div>
            <motion.div className="text-[10px] text-muted-foreground">{formatTime(bill.timestamp)}</motion.div>
          </motion.div>
          <motion.div className="hidden md:block">
            <div className="text-sm font-medium">{bill.items.length} items</div>
            <div className="text-xs text-muted-foreground truncate">
              {bill.items.map((i) => i.name).slice(0, 2).join(", ")}
              {bill.items.length > 2 ? "…" : ""}
            </div>
          </motion.div>
          <motion.div className="flex items-center gap-1.5">
            <PayIcon className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs capitalize">{bill.paymentMethod}</span>
            {bill.fromOcr && <ScanLine className="w-3 h-3 text-accent ml-1" />}
          </motion.div>
          <motion.div className="flex items-center gap-1.5">
            <SrcIcon className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs capitalize">{bill.source}</span>
            {bill.orderType === "student" && <GraduationCap className="w-3 h-3 text-primary" />}
          </motion.div>
          <motion.div className="text-right">
            <div className="font-display font-semibold">₹{bill.total.toLocaleString()}</div>
            <motion.div className="text-[10px] text-muted-foreground font-mono">GST ₹{bill.gstAmount}</motion.div>
          </motion.div>
        </div>
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="px-4 pb-4 border-t border-border/30"
        >
          <table className="w-full text-sm mt-3">
            <thead>
              <tr className="text-xs text-muted-foreground uppercase tracking-wider">
                <th className="text-left py-2">Item</th>
                <th className="text-center py-2">Qty</th>
                <th className="text-right py-2">Price</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {bill.items.map((line, i) => (
                <tr key={i} className="border-t border-border/20">
                  <td className="py-2.5 font-medium">{line.name}</td>
                  <td className="py-2.5 text-center font-mono">{line.qty}</td>
                  <td className="py-2.5 text-right font-mono text-muted-foreground">₹{line.unitPrice}</td>
                  <td className="py-2.5 text-right font-mono">₹{line.lineTotal.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-primary/20">
                <td colSpan={3} className="py-2 text-muted-foreground">Subtotal</td>
                <td className="py-2 text-right font-mono">₹{bill.subtotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td colSpan={3} className="py-1 text-muted-foreground">GST ({(bill.gstRate * 100).toFixed(0)}%)</td>
                <td className="py-1 text-right font-mono">₹{bill.gstAmount.toLocaleString()}</td>
              </tr>
              {bill.packagingCharge > 0 && (
                <tr>
                  <td colSpan={3} className="py-1 text-muted-foreground">Packaging</td>
                  <td className="py-1 text-right font-mono">₹{bill.packagingCharge}</td>
                </tr>
              )}
              <tr className="font-semibold">
                <td colSpan={3} className="py-2">Total</td>
                <td className="py-2 text-right font-display text-primary">₹{bill.total.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
          <div className="flex flex-wrap gap-2 mt-3 text-[10px] font-mono">
            {bill.tableNumber && <span className="px-2 py-1 rounded-md bg-secondary">Table {bill.tableNumber}</span>}
            <span className="px-2 py-1 rounded-md bg-secondary capitalize">{bill.orderType}</span>
            <span className="px-2 py-1 rounded-md bg-secondary capitalize">{bill.source}</span>
            <span className="px-2 py-1 rounded-md bg-primary/10 text-primary capitalize">{bill.paymentMethod}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function Billing() {
  const { snapshot } = useRestaurant();
  const { bills, categoryShare, topItems, totals } = snapshot;
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const searched = search.trim() ? searchBills(bills, search) : bills;
    return searched.filter((b) => {
      const matchPay = paymentFilter === "all" || b.paymentMethod === paymentFilter;
      const matchSrc = sourceFilter === "all" || b.source === sourceFilter;
      return matchPay && matchSrc;
    });
  }, [bills, search, paymentFilter, sourceFilter]);

  const paymentBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of bills.slice(0, 500)) {
      map.set(b.paymentMethod, (map.get(b.paymentMethod) ?? 0) + b.total);
    }
    return [...map.entries()].map(([name, value]) => ({ name, value }));
  }, [bills]);

  return (
    <div>
      <Topbar
        title="Billing Intelligence Center"
        subtitle={`${bills.length.toLocaleString()} transactions · Truffles Sanjaynagar · Live`}
      />
      <div className="px-6 lg:px-10 py-8 space-y-8">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="glass rounded-2xl p-5 glow-primary">
            <motion.div className="text-xs text-muted-foreground uppercase tracking-wider">Revenue today</motion.div>
            <motion.div className="font-display text-3xl font-semibold mt-2 gradient-text">
              ₹{totals.revenueToday.toLocaleString()}
            </motion.div>
            <motion.div className="text-xs text-primary mt-1 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              LIVE · {totals.ordersToday} orders
            </motion.div>
          </div>
          <div className="glass rounded-2xl p-5">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Units sold today</div>
            <div className="font-display text-3xl font-semibold mt-2">{totals.unitsSoldToday.toLocaleString()}</div>
            <motion.div className="text-xs text-muted-foreground mt-1">{snapshot.menu.length} menu SKUs tracked</motion.div>
          </div>
          <div className="glass rounded-2xl p-5">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Avg ticket</div>
            <div className="font-display text-3xl font-semibold mt-2">₹{totals.avgTicket}</div>
            <motion.div className="text-xs text-muted-foreground mt-1">incl. 5% GST · prices tax-inclusive</motion.div>
          </div>
          <div className="glass rounded-2xl p-5">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">7-day revenue</div>
            <div className="font-display text-3xl font-semibold mt-2">₹{totals.revenueWeek.toLocaleString()}</div>
            <motion.div className="text-xs text-muted-foreground mt-1">{totals.profitMargin.toFixed(1)}% est. margin</motion.div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Payment channel mix</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={paymentBreakdown}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Category share</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={categoryShare} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {categoryShare.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="hsl(var(--background))" strokeWidth={2} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {categoryShare.slice(0, 5).map((c, i) => (
                <motion.div key={c.name} className="flex justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-sm" style={{ background: COLORS[i] }} />
                    {c.name}
                  </span>
                  <span className="font-mono text-muted-foreground">{c.value}%</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                <Receipt className="w-4 h-4 text-primary" />
                Transaction ledger
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Every bill · searchable · {filtered.length} shown
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search bill ID or item…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-secondary/50 border-border/50"
                />
              </div>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-[130px] bg-secondary/50">
                  <Filter className="w-3 h-3 mr-1" />
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All payments</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="swiggy">Swiggy</SelectItem>
                  <SelectItem value="zomato">Zomato</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[130px] bg-secondary/50">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sources</SelectItem>
                  <SelectItem value="dine-in">Dine-in</SelectItem>
                  <SelectItem value="takeaway">Takeaway</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filtered.slice(0, 80).map((bill) => (
              <BillRow
                key={bill.id}
                bill={bill}
                expanded={expandedId === bill.id}
                onToggle={() => setExpandedId(expandedId === bill.id ? null : bill.id)}
              />
            ))}
            {filtered.length > 80 && (
              <p className="text-center text-xs text-muted-foreground py-4">
                Showing 80 of {filtered.length} — refine search to narrow results
              </p>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold mb-4">Top items by revenue (today)</h3>
          <motion.div className="space-y-2">
            {topItems.slice(0, 8).map((item, i) => (
              <motion.div
                key={item.menuItemId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/30"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground w-5">{i + 1}</span>
                  <div>
                    <motion.div className="font-medium text-sm">{item.name}</motion.div>
                    <motion.div className="text-xs text-muted-foreground">{item.category} · ₹{item.price}</motion.div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm">{item.sold} sold</div>
                  <div className="font-display font-semibold text-sm">₹{item.revenue.toLocaleString()}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
