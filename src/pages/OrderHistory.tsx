import DashboardLayout from "@/components/layout/DashboardLayout";
import { ClipboardList } from "lucide-react";

const mockOrders = [
  {
    id: "ORD-001",
    date: "2025-01-15",
    status: "completed",
    items: ["Midnight Reserve Bourbon", "Crystal Noir Vodka"],
    total: 1900,
    btcAmount: "0.02818",
    txHash: "3a1b9c...f4e2d1",
  },
  {
    id: "ORD-002",
    date: "2025-02-01",
    status: "confirmed",
    items: ["The Inner Circle Blend"],
    total: 750,
    btcAmount: "0.01112",
    txHash: "7d3e8f...a2c5b9",
  },
];

const statusColors: Record<string, string> = {
  pending_payment: "text-yellow-400",
  payment_detected: "text-blue-400",
  confirming: "text-blue-400",
  confirmed: "text-primary",
  completed: "text-emerald-400",
  expired: "text-destructive",
};

export default function OrderHistory() {
  return (
    <DashboardLayout>
      <h1 className="font-serif text-3xl text-foreground mb-8 glow-text">Order History</h1>

      {mockOrders.length === 0 ? (
        <div className="text-center py-20">
          <ClipboardList className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground font-sans">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {mockOrders.map((order) => (
            <div key={order.id} className="glass rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-serif text-lg text-foreground">{order.id}</h3>
                  <p className="text-xs text-muted-foreground font-sans">{order.date}</p>
                </div>
                <span className={`text-xs font-sans font-bold tracking-wider uppercase ${statusColors[order.status] || "text-foreground"}`}>
                  {order.status.replace("_", " ")}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground font-sans mb-1">Items</p>
                  <p className="text-sm text-foreground font-sans">{order.items.join(", ")}</p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-lg text-foreground">${order.total.toLocaleString()}</p>
                  <p className="text-xs text-primary font-sans font-medium">{order.btcAmount} BTC</p>
                  <p className="text-[10px] text-muted-foreground/50 font-mono mt-1">tx: {order.txHash}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
