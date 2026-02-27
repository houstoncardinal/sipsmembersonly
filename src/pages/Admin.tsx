import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useInvite } from "@/context/InviteContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import {
  Users,
  Package,
  ClipboardList,
  Shield,
  Activity,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Crown,
  Key,
  ArrowRight,
  Bell,
  Calendar,
  Clock,
  Star,
  Zap,
  Target,
  Award,
} from "lucide-react";

const mockMembers = [
  { id: "1", email: "admin@sipsgettinreal.test", role: "admin", status: "active", lastLogin: "2025-02-19", joinedAt: "2025-01-01", orders: 15, spent: 12500 },
  { id: "2", email: "member@sipsgettinreal.test", role: "member", status: "active", lastLogin: "2025-02-18", joinedAt: "2025-01-15", orders: 3, spent: 2100 },
  { id: "3", email: "vip@example.com", role: "member", status: "active", lastLogin: "2025-02-17", joinedAt: "2025-02-01", orders: 1, spent: 4500 },
];

const mockAuditLogs = [
  { id: "1", time: "2025-02-19 14:32", event: "login_success", user: "admin@sipsgettinreal.test", detail: "IP: 192.168.1.1" },
  { id: "2", time: "2025-02-19 12:15", event: "invite_created", user: "admin@sipsgettinreal.test", detail: "Code: ABCD-1234" },
  { id: "3", time: "2025-02-19 09:44", event: "payment_completed", user: "member@sipsgettinreal.test", detail: "ORD-001 · 0.028 BTC" },
];

const mockRecentOrders = [
  { id: "ORD-001", customer: "John Smith", total: 1900, status: "completed", date: "2025-02-19" },
  { id: "ORD-002", customer: "Sarah Johnson", total: 4500, status: "confirmed", date: "2025-02-18" },
  { id: "ORD-003", customer: "Michael Chen", total: 750, status: "confirming", date: "2025-02-18" },
];

export default function Admin() {
  const { user } = useAuth();
  const { inviteCodes } = useInvite();
  const navigate = useNavigate();

  useState(() => {
    if (user?.role !== "admin") navigate("/dashboard");
  });

  if (user?.role !== "admin") return null;

  const totalRevenue = mockMembers.reduce((sum, m) => sum + m.spent, 0);
  const totalOrders = mockMembers.reduce((sum, m) => sum + m.orders, 0);

  // Revenue data for chart (mock)
  const revenueData = [
    { day: "Mon", revenue: 12500 },
    { day: "Tue", revenue: 18200 },
    { day: "Wed", revenue: 15800 },
    { day: "Thu", revenue: 22400 },
    { day: "Fri", revenue: 28900 },
    { day: "Sat", revenue: 31200 },
    { day: "Sun", revenue: 25600 },
  ];
  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-serif text-4xl text-slate-900 mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-slate-600">Here's what's happening with your store today.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-purple-300 transition-colors shadow-sm">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-purple-300 transition-colors shadow-sm">
                <Calendar className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Revenue",
              value: `$${totalRevenue.toLocaleString()}`,
              icon: DollarSign,
              change: "+12.5%",
              trend: "up",
              color: "purple",
              gradient: "from-purple-500 to-purple-700",
            },
            {
              label: "Total Orders",
              value: totalOrders.toString(),
              icon: ShoppingBag,
              change: "+8.2%",
              trend: "up",
              color: "blue",
              gradient: "from-blue-500 to-blue-700",
            },
            {
              label: "Active Members",
              value: mockMembers.length.toString(),
              icon: Users,
              change: "+3.1%",
              trend: "up",
              color: "green",
              gradient: "from-green-500 to-green-700",
            },
            {
              label: "Active Invites",
              value: inviteCodes.filter((i) => i.isActive).length.toString(),
              icon: Key,
              change: "0%",
              trend: "neutral",
              color: "orange",
              gradient: "from-orange-500 to-orange-700",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${stat.gradient} text-white shadow-xl`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm ${
                    stat.trend === "up" ? "text-green-300" : stat.trend === "down" ? "text-red-300" : "text-yellow-300"
                  }`}>
                    {stat.trend === "up" ? <TrendingUp className="w-3 h-3" /> : stat.trend === "down" ? <TrendingDown className="w-3 h-3" /> : null}
                    {stat.change}
                  </div>
                </div>
                <p className="text-white/80 text-sm font-medium mb-1">{stat.label}</p>
                <p className="font-serif text-3xl font-bold">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl text-slate-900">Revenue Overview</h2>
                <p className="text-sm text-slate-500">Last 7 days performance</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 text-purple-600 font-semibold hover:bg-purple-100 transition-colors">
                <Activity className="w-4 h-4" />
                View Analytics
              </button>
            </div>
            
            {/* Chart */}
            <div className="h-64 flex items-end gap-4">
              {revenueData.map((day, i) => (
                <motion.div
                  key={day.day}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: `${(day.revenue / maxRevenue) * 100}%`, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full gradient-primary rounded-t-lg relative group cursor-pointer">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ${(day.revenue / 1000).toFixed(1)}K
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{day.day}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl text-slate-900">Quick Actions</h2>
              <Zap className="w-5 h-5 text-purple-500" />
            </div>
            <div className="space-y-3">
              {[
                { label: "Create Invite Code", icon: Key, path: "/admin/invites", color: "purple" },
                { label: "Manage Products", icon: Package, path: "/admin/products", color: "blue" },
                { label: "View Orders", icon: ClipboardList, path: "/admin/orders", color: "green" },
                { label: "Member Management", icon: Users, path: "/admin/members", color: "orange" },
                { label: "Security & Audit", icon: Shield, path: "/admin/security", color: "red" },
              ].map((action, i) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  whileHover={{ x: 5 }}
                  onClick={() => navigate(action.path)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-${action.color}-50 to-${action.color}-100 hover:from-${action.color}-100 hover:to-${action.color}-150 transition-all group border border-${action.color}-200`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-${action.color}-500 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`font-semibold text-${action.color}-700 flex-1 text-left`}>
                    {action.label}
                  </span>
                  <ArrowRight className={`w-4 h-4 text-${action.color}-500 group-hover:translate-x-1 transition-transform`} />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity & Top Members */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl text-slate-900">Recent Orders</h2>
                <p className="text-sm text-slate-500">Latest transactions</p>
              </div>
              <button 
                onClick={() => navigate("/admin/orders")}
                className="text-purple-600 font-semibold hover:text-purple-700 transition-colors flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {mockRecentOrders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-purple-50 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold">
                      {order.customer[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{order.id}</p>
                      <p className="text-sm text-slate-500">{order.customer} · {order.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-serif font-bold text-slate-900">${order.total.toLocaleString()}</p>
                    <p className={`text-xs font-semibold capitalize ${
                      order.status === "completed" ? "text-green-600" :
                      order.status === "confirmed" ? "text-purple-600" :
                      "text-yellow-600"
                    }`}>
                      {order.status}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Top Members */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl text-slate-900">Top Members</h2>
                <p className="text-sm text-slate-500">Highest spending customers</p>
              </div>
              <button 
                onClick={() => navigate("/admin/members")}
                className="text-purple-600 font-semibold hover:text-purple-700 transition-colors flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {mockMembers
                .sort((a, b) => b.spent - a.spent)
                .slice(0, 3)
                .map((member, i) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-purple-50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                          {member.name[0]}
                        </div>
                        {i === 0 && (
                          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center">
                            <Crown className="w-3 h-3 text-yellow-800" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{member.name}</p>
                        <p className="text-sm text-slate-500">{member.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-serif font-bold text-purple-600">${member.spent.toLocaleString()}</p>
                      {i === 0 && <Star className="w-4 h-4 text-yellow-400 ml-auto" />}
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl text-slate-900">Activity Log</h2>
              <p className="text-sm text-slate-500">Recent system activity</p>
            </div>
            <button 
              onClick={() => navigate("/admin/security")}
              className="text-purple-600 font-semibold hover:text-purple-700 transition-colors flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {mockAuditLogs.map((log, i) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-purple-50 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full ${
                  log.event.includes("success") ? "bg-green-500" :
                  log.event.includes("created") ? "bg-blue-500" :
                  log.event.includes("payment") ? "bg-purple-500" :
                  "bg-orange-500"
                }`} />
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 capitalize">{log.event.replace("_", " ")}</p>
                  <p className="text-sm text-slate-500">{log.user} · {log.detail}</p>
                </div>
                <p className="text-xs text-slate-400 font-mono">{log.time}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
