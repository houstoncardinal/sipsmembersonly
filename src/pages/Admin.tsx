import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { products } from "@/data/products";
import { motion } from "framer-motion";
import { Users, Package, ClipboardList, Shield, Activity } from "lucide-react";
import { useEffect } from "react";

const tabs = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "products", label: "Products", icon: Package },
  { id: "members", label: "Members", icon: Users },
  { id: "orders", label: "Orders", icon: ClipboardList },
  { id: "audit", label: "Audit Log", icon: Shield },
];

const mockMembers = [
  { email: "admin@sipsgettinreal.test", role: "admin", status: "active", lastLogin: "2025-02-18" },
  { email: "member@sipsgettinreal.test", role: "member", status: "active", lastLogin: "2025-02-17" },
];

const mockAuditLogs = [
  { time: "2025-02-18 14:32", event: "login_success", user: "admin@sipsgettinreal.test", detail: "IP: 192.168.1.1" },
  { time: "2025-02-18 12:15", event: "phrase_verified", user: "member@sipsgettinreal.test", detail: "Attempt 1" },
  { time: "2025-02-17 09:44", event: "payment_completed", user: "member@sipsgettinreal.test", detail: "ORD-001 · 0.028 BTC" },
];

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (user?.role !== "admin") navigate("/dashboard");
  }, [user, navigate]);

  if (user?.role !== "admin") return null;

  return (
    <DashboardLayout>
      <h1 className="font-serif text-3xl text-foreground mb-8 glow-text">Admin Panel</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-sans font-medium tracking-wider transition-all duration-300 ${
              activeTab === tab.id
                ? "gradient-primary text-primary-foreground"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Products", value: products.length, icon: Package },
            { label: "Total Members", value: mockMembers.length, icon: Users },
            { label: "Total Orders", value: 2, icon: ClipboardList },
            { label: "BTC Revenue", value: "0.039 ₿", icon: Activity },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground font-sans">{stat.label}</span>
              </div>
              <p className="font-serif text-2xl text-foreground">{stat.value}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Products */}
      {activeTab === "products" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl overflow-hidden">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Product</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Category</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Price</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border/10 hover:bg-muted/20 transition-colors">
                  <td className="p-4 text-foreground">{p.name}</td>
                  <td className="p-4 text-muted-foreground">{p.categoryLabel}</td>
                  <td className="p-4 text-foreground">${p.price.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={p.stock <= 10 ? "text-destructive" : "text-foreground"}>{p.stock}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Members */}
      {activeTab === "members" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl overflow-hidden">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Email</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Role</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Status</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Last Login</th>
              </tr>
            </thead>
            <tbody>
              {mockMembers.map((m) => (
                <tr key={m.email} className="border-b border-border/10">
                  <td className="p-4 text-foreground">{m.email}</td>
                  <td className="p-4 text-primary font-medium uppercase text-xs tracking-wider">{m.role}</td>
                  <td className="p-4 text-emerald-400">{m.status}</td>
                  <td className="p-4 text-muted-foreground">{m.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Orders */}
      {activeTab === "orders" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <ClipboardList className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-sans">Order management will be available with Lovable Cloud.</p>
        </motion.div>
      )}

      {/* Audit Log */}
      {activeTab === "audit" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {mockAuditLogs.map((log, i) => (
            <div key={i} className="glass rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <span className="text-xs text-muted-foreground font-mono w-36 flex-shrink-0">{log.time}</span>
              <span className="text-xs font-sans font-bold tracking-wider uppercase text-primary">{log.event}</span>
              <span className="text-xs text-foreground font-sans flex-1">{log.user}</span>
              <span className="text-xs text-muted-foreground font-sans">{log.detail}</span>
            </div>
          ))}
        </motion.div>
      )}
    </DashboardLayout>
  );
}
