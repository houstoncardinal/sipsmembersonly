import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Search,
  Filter,
  Download,
  Eye,
  Package,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ChevronDown,
  Mail,
  Truck,
  CreditCard,
  RefreshCw,
} from "lucide-react";

interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  total: number;
  btcAmount: string;
  status: "pending_payment" | "payment_detected" | "confirming" | "confirmed" | "completed" | "expired";
  items: number;
  confirmations: number;
  txHash?: string;
  shippingAddress?: string;
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customer: "John Smith",
    email: "john@example.com",
    date: "2025-02-19",
    total: 1900,
    btcAmount: "0.02818000",
    status: "completed",
    items: 2,
    confirmations: 6,
    txHash: "3a1b9c4f5e6d7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    shippingAddress: "123 Main St, New York, NY 10001",
  },
  {
    id: "ORD-002",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    date: "2025-02-18",
    total: 4500,
    btcAmount: "0.06675000",
    status: "confirmed",
    items: 1,
    confirmations: 3,
    txHash: "7d3e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e",
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90001",
  },
  {
    id: "ORD-003",
    customer: "Michael Chen",
    email: "michael@example.com",
    date: "2025-02-18",
    total: 750,
    btcAmount: "0.01112500",
    status: "confirming",
    items: 1,
    confirmations: 1,
    txHash: "9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f",
  },
  {
    id: "ORD-004",
    customer: "Emily Davis",
    email: "emily@example.com",
    date: "2025-02-17",
    total: 2200,
    btcAmount: "0.03263000",
    status: "payment_detected",
    items: 1,
    confirmations: 0,
  },
  {
    id: "ORD-005",
    customer: "David Wilson",
    email: "david@example.com",
    date: "2025-02-17",
    total: 320,
    btcAmount: "0.00474500",
    status: "pending_payment",
    items: 1,
    confirmations: 0,
  },
  {
    id: "ORD-006",
    customer: "Lisa Anderson",
    email: "lisa@example.com",
    date: "2025-02-16",
    total: 680,
    btcAmount: "0.01008500",
    status: "expired",
    items: 2,
    confirmations: 0,
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: any; description: string }> = {
  pending_payment: { label: "Pending", color: "yellow", icon: Clock, description: "Awaiting payment" },
  payment_detected: { label: "Payment Detected", color: "blue", icon: AlertCircle, description: "Transaction in mempool" },
  confirming: { label: "Confirming", color: "blue", icon: Clock, description: "Waiting for confirmations" },
  confirmed: { label: "Confirmed", color: "purple", icon: CheckCircle2, description: "Payment confirmed" },
  completed: { label: "Completed", color: "green", icon: CheckCircle2, description: "Order fulfilled" },
  expired: { label: "Expired", color: "red", icon: XCircle, description: "Payment window expired" },
};

export default function AdminOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dateRange, setDateRange] = useState("7d");

  useEffect(() => {
    if (user?.role !== "admin") navigate("/dashboard");
  }, [user, navigate]);

  if (user?.role !== "admin") return null;

  const filteredOrders = orders.filter((order) => {
    const matchSearch = 
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || order.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Stats
  const totalRevenue = orders.filter(o => o.status === "completed" || o.status === "confirmed").reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === "pending_payment" || o.status === "payment_detected").length;
  const completingOrders = orders.filter(o => o.status === "confirming" || o.status === "confirmed").length;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-4xl text-slate-900 mb-2">Order Management</h1>
              <p className="text-sm text-slate-600 font-sans">Track and manage all orders</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-purple-300 transition-colors">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-purple-300 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, change: "+12.5%", color: "green" },
            { label: "Pending Orders", value: pendingOrders.toString(), icon: Clock, change: "-2.3%", color: "yellow" },
            { label: "Confirming", value: completingOrders.toString(), icon: CheckCircle2, change: "+5.1%", color: "blue" },
            { label: "Completed", value: orders.filter(o => o.status === "completed").length.toString(), icon: Package, change: "+8.2%", color: "purple" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className="text-xs font-sans font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-slate-500 font-sans mb-1">{stat.label}</p>
              <p className="font-serif text-3xl font-bold text-slate-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by customer, email, or order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-purple-500 bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="pending_payment">Pending Payment</option>
                <option value="payment_detected">Payment Detected</option>
                <option value="confirming">Confirming</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
              {["24h", "7d", "30d", "90d", "all"].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-3 py-1.5 rounded-md text-sm font-sans font-medium transition-colors ${
                    dateRange === range
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider">Order</th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider">Confirmations</th>
                  <th className="text-right p-4 text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const StatusIcon = statusConfig[order.status].icon;
                  return (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-sans font-bold text-slate-900">{order.id}</p>
                          <p className="text-xs text-slate-500 font-mono">{order.items} items</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                            {order.customer[0]}
                          </div>
                          <div>
                            <p className="font-sans font-semibold text-slate-900">{order.customer}</p>
                            <p className="text-xs text-slate-500">{order.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-slate-600 font-mono">{order.date}</p>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-serif font-bold text-slate-900">${order.total.toLocaleString()}</p>
                          <p className="text-xs text-purple-600 font-mono">{order.btcAmount} BTC</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`w-4 h-4 text-${statusConfig[order.status].color}-500`} />
                          <span className={`text-xs font-sans font-semibold px-2.5 py-1 rounded-full bg-${statusConfig[order.status].color}-50 text-${statusConfig[order.status].color}-600`}>
                            {statusConfig[order.status].label}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        {order.confirmations > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-1">
                              {[...Array(Math.min(order.confirmations, 3))].map((_, i) => (
                                <div key={i} className="w-5 h-5 rounded-full bg-green-500 border-2 border-white" />
                              ))}
                            </div>
                            <span className="text-sm text-slate-600">{order.confirmations} / 2</span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 rounded-lg hover:bg-purple-50 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-purple-500" />
                          </button>
                          <button
                            className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Send Email"
                          >
                            <Mail className="w-4 h-4 text-blue-500" />
                          </button>
                          {order.status === "completed" && (
                            <button
                              className="p-2 rounded-lg hover:bg-green-50 transition-colors"
                              title="Track Shipment"
                            >
                              <Truck className="w-4 h-4 text-green-500" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Detail Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={() => setSelectedOrder(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl">
                  <div>
                    <h2 className="font-serif text-2xl text-slate-900">{selectedOrder.id}</h2>
                    <p className="text-sm text-slate-500 font-mono">{selectedOrder.date}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <XCircle className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Status */}
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {(() => {
                          const StatusIcon = statusConfig[selectedOrder.status].icon;
                          return (
                            <div className={`w-12 h-12 rounded-xl bg-${statusConfig[selectedOrder.status].color}-100 flex items-center justify-center`}>
                              <StatusIcon className={`w-6 h-6 text-${statusConfig[selectedOrder.status].color}-600`} />
                            </div>
                          );
                        })()}
                        <div>
                          <p className="font-sans font-semibold text-slate-900">
                            {statusConfig[selectedOrder.status].label}
                          </p>
                          <p className="text-sm text-slate-500">
                            {statusConfig[selectedOrder.status].description}
                          </p>
                        </div>
                      </div>
                      {selectedOrder.confirmations >= 2 && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="font-sans font-semibold">Verified</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div>
                    <h3 className="font-sans font-semibold text-slate-700 mb-3">Customer</h3>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                      <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                        {selectedOrder.customer[0]}
                      </div>
                      <div>
                        <p className="font-sans font-semibold text-slate-900">{selectedOrder.customer}</p>
                        <p className="text-sm text-slate-500">{selectedOrder.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div>
                    <h3 className="font-sans font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-purple-500" />
                      Payment Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-xl">
                        <p className="text-xs text-slate-500 mb-1">USD Amount</p>
                        <p className="font-serif text-xl font-bold text-slate-900">${selectedOrder.total.toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl">
                        <p className="text-xs text-slate-500 mb-1">BTC Amount</p>
                        <p className="font-serif text-xl font-bold text-purple-600">{selectedOrder.btcAmount}</p>
                      </div>
                      {selectedOrder.txHash && (
                        <div className="md:col-span-2 p-4 bg-slate-50 rounded-xl">
                          <p className="text-xs text-slate-500 mb-1">Transaction Hash</p>
                          <p className="font-mono text-sm text-slate-700 break-all">{selectedOrder.txHash}</p>
                        </div>
                      )}
                      <div className="p-4 bg-slate-50 rounded-xl">
                        <p className="text-xs text-slate-500 mb-1">Confirmations</p>
                        <p className="font-serif text-xl font-bold text-slate-900">{selectedOrder.confirmations} / 2</p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping */}
                  {selectedOrder.shippingAddress && (
                    <div>
                      <h3 className="font-sans font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <Truck className="w-4 h-4 text-purple-500" />
                        Shipping Address
                      </h3>
                      <div className="p-4 bg-slate-50 rounded-xl">
                        <p className="text-slate-700">{selectedOrder.shippingAddress}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white rounded-b-3xl">
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-sans font-semibold hover:bg-slate-200 transition-colors">
                    <Mail className="w-4 h-4" />
                    Email Customer
                  </button>
                  {selectedOrder.status === "completed" && (
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-white font-sans font-semibold shadow-lg shadow-purple-500/30">
                      <Truck className="w-4 h-4" />
                      Track Shipment
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
