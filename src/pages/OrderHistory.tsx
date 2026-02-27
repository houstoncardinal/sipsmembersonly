import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronRight,
  ExternalLink,
  Bitcoin,
  ShieldCheck,
} from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  status: "pending_payment" | "payment_detected" | "confirming" | "confirmed" | "completed" | "expired";
  items: OrderItem[];
  total: number;
  btcAmount: string;
  txHash?: string;
  confirmations?: number;
  shippingAddress?: string;
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    date: "2025-02-15",
    status: "completed",
    items: [
      { id: "pd-001", name: "Midnight Reserve Bourbon", quantity: 1, price: 1250 },
      { id: "cl-002", name: "Crystal Noir Vodka", quantity: 1, price: 650 },
    ],
    total: 1900,
    btcAmount: "0.02818000",
    txHash: "3a1b9c4f5e6d7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    confirmations: 6,
    shippingAddress: "123 Private Lane, Members Only, CA 90210",
  },
  {
    id: "ORD-002",
    date: "2025-02-10",
    status: "confirmed",
    items: [
      { id: "me-001", name: "The Inner Circle Blend", quantity: 2, price: 750 },
    ],
    total: 1500,
    btcAmount: "0.02225000",
    txHash: "7d3e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7",
    confirmations: 3,
    shippingAddress: "123 Private Lane, Members Only, CA 90210",
  },
  {
    id: "ORD-003",
    date: "2025-02-05",
    status: "completed",
    items: [
      { id: "nv-001", name: "Purple Reign Cocktail Kit", quantity: 1, price: 320 },
      { id: "nv-002", name: "Glow Tonic Mixer Set", quantity: 2, price: 180 },
    ],
    total: 680,
    btcAmount: "0.01008500",
    txHash: "9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0",
    confirmations: 12,
    shippingAddress: "123 Private Lane, Members Only, CA 90210",
  },
];

const statusConfig: Record<string, { label: string; icon: React.ComponentType; color: string; description: string }> = {
  pending_payment: {
    label: "Pending Payment",
    icon: Clock,
    color: "text-yellow-400",
    description: "Waiting for payment",
  },
  payment_detected: {
    label: "Payment Detected",
    icon: AlertCircle,
    color: "text-blue-400",
    description: "Transaction found on mempool",
  },
  confirming: {
    label: "Confirming",
    icon: Clock,
    color: "text-blue-400",
    description: "Waiting for confirmations",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    color: "text-primary",
    description: "Payment confirmed on chain",
  },
  completed: {
    label: "Completed",
    icon: ShieldCheck,
    color: "text-emerald-400",
    description: "Order fulfilled",
  },
  expired: {
    label: "Expired",
    icon: XCircle,
    color: "text-destructive",
    description: "Payment window expired",
  },
};

export default function OrderHistory() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-3xl text-foreground mb-2 glow-text">Order History</h1>
        <p className="text-sm text-muted-foreground font-sans mb-8">
          Track your exclusive purchases and blockchain confirmations
        </p>

        {mockOrders.length === 0 ? (
          <div className="text-center py-20">
            <ClipboardList className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="font-serif text-xl text-foreground mb-2">No Orders Yet</h2>
            <p className="text-sm text-muted-foreground font-sans mb-6">
              Browse the collection to make your first purchase.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockOrders.map((order, index) => {
              const StatusIcon = statusConfig[order.status].icon;
              const isExpanded = selectedOrder === order.id;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass rounded-xl overflow-hidden glow-border"
                >
                  {/* Order Header */}
                  <div
                    className="p-5 cursor-pointer hover:bg-muted/20 transition-colors"
                    onClick={() => setSelectedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-base text-foreground">{order.id}</h3>
                          <p className="text-xs text-muted-foreground font-sans">{order.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <p className="font-serif text-sm text-foreground">${order.total.toLocaleString()}</p>
                          <p className="text-[10px] text-primary font-sans font-medium">{order.btcAmount} BTC</p>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 ${statusConfig[order.status].color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-sans font-bold tracking-wider uppercase">
                            {statusConfig[order.status].label}
                          </span>
                        </div>
                        <ChevronRight
                          className={`w-5 h-5 text-muted-foreground transition-transform ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border/30 p-5 space-y-5">
                          {/* Items */}
                          <div>
                            <h4 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wider mb-3">
                              Items
                            </h4>
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/20"
                                >
                                  <div>
                                    <p className="text-sm text-foreground font-sans">{item.name}</p>
                                    <p className="text-xs text-muted-foreground font-sans">
                                      Qty: {item.quantity} × ${(item.price).toLocaleString()}
                                    </p>
                                  </div>
                                  <p className="text-sm font-serif text-foreground">
                                    ${(item.price * item.quantity).toLocaleString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Payment Info */}
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="glass rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <Bitcoin className="w-4 h-4 text-primary" />
                                <h4 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wider">
                                  Payment Details
                                </h4>
                              </div>
                              <div className="space-y-2 text-xs font-sans">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Amount Paid</span>
                                  <span className="text-foreground">{order.btcAmount} BTC</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">USD Value</span>
                                  <span className="text-foreground">${order.total.toLocaleString()}</span>
                                </div>
                                {order.confirmations !== undefined && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Confirmations</span>
                                    <span className="text-primary">{order.confirmations}</span>
                                  </div>
                                )}
                                {order.txHash && (
                                  <div className="pt-2">
                                    <span className="text-muted-foreground">Transaction Hash</span>
                                    <div className="flex items-center gap-2 mt-1">
                                      <code className="text-[10px] text-foreground/70 font-mono break-all">
                                        {order.txHash.slice(0, 12)}...{order.txHash.slice(-8)}
                                      </code>
                                      <button className="flex-shrink-0 text-primary hover:underline">
                                        <ExternalLink className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Status Info */}
                            <div className="glass rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <ShieldCheck className="w-4 h-4 text-primary" />
                                <h4 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wider">
                                  Order Status
                                </h4>
                              </div>
                              <div className="space-y-3">
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 ${statusConfig[order.status].color}`}>
                                  <StatusIcon className="w-4 h-4" />
                                  <span className="text-xs font-sans font-bold tracking-wider uppercase">
                                    {statusConfig[order.status].label}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground font-sans">
                                  {statusConfig[order.status].description}
                                </p>
                                {order.status === "completed" && (
                                  <p className="text-xs text-emerald-400 font-sans flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Ready for shipment
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Shipping Address */}
                          {order.shippingAddress && (
                            <div>
                              <h4 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wider mb-2">
                                Shipping Address
                              </h4>
                              <p className="text-sm text-foreground font-sans">{order.shippingAddress}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
