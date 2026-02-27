import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  KeyRound,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  Fingerprint,
  Server,
  TrendingUp,
  UserCog,
} from "lucide-react";

interface AuditLog {
  id: string;
  timestamp: string;
  event: string;
  user: string;
  details: string;
  severity: "low" | "medium" | "high" | "critical";
}

const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    timestamp: "2025-02-19 14:32:15",
    event: "login_success",
    user: "admin@sipsgettinreal.test",
    details: "Successful login from verified device",
    severity: "low",
  },
  {
    id: "2",
    timestamp: "2025-02-19 12:15:42",
    event: "invite_created",
    user: "admin@sipsgettinreal.test",
    details: "Created invite code: ABCD-1234 (Multi-use, 50 uses)",
    severity: "low",
  },
  {
    id: "3",
    timestamp: "2025-02-19 09:44:18",
    event: "payment_completed",
    user: "member@sipsgettinreal.test",
    details: "Order ORD-001 completed - 0.028 BTC",
    severity: "low",
  },
  {
    id: "4",
    timestamp: "2025-02-18 16:22:33",
    event: "phrase_reset",
    user: "admin@sipsgettinreal.test",
    details: "Reset access phrase for: vip@example.com",
    severity: "medium",
  },
  {
    id: "5",
    timestamp: "2025-02-18 14:10:05",
    event: "failed_login",
    user: "unknown@example.com",
    details: "Failed login attempt - Invalid credentials (Attempt 3/5)",
    severity: "medium",
  },
  {
    id: "6",
    timestamp: "2025-02-18 11:05:22",
    event: "account_locked",
    user: "suspended@example.com",
    details: "Account locked after 5 failed attempts",
    severity: "high",
  },
  {
    id: "7",
    timestamp: "2025-02-17 23:45:11",
    event: "suspicious_activity",
    user: "system",
    details: "Multiple failed access phrase attempts detected",
    severity: "critical",
  },
];

const severityConfig: Record<string, { label: string; color: string; icon: any }> = {
  low: { label: "Info", color: "blue", icon: CheckCircle2 },
  medium: { label: "Warning", color: "yellow", icon: AlertTriangle },
  high: { label: "High", color: "orange", icon: AlertTriangle },
  critical: { label: "Critical", color: "red", icon: XCircle },
};

export default function AdminSecurity() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");
  const [timeRange, setTimeRange] = useState("24h");

  useEffect(() => {
    if (user?.role !== "admin") navigate("/dashboard");
  }, [user, navigate]);

  if (user?.role !== "admin") return null;

  const filteredLogs = logs.filter((log) => {
    const matchSearch = 
      log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSeverity = severityFilter === "all" || log.severity === severityFilter;
    return matchSearch && matchSeverity;
  });

  // Stats
  const totalEvents = logs.length;
  const criticalEvents = logs.filter((l) => l.severity === "critical").length;
  const highEvents = logs.filter((l) => l.severity === "high").length;
  const failedLogins = logs.filter((l) => l.event.includes("failed")).length;

  const eventTypes = [...new Set(logs.map((l) => l.event))];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-4xl text-slate-900 mb-2">Security & Audit</h1>
              <p className="text-slate-600">Monitor security events and system activity</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-purple-300 transition-colors">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-purple-300 transition-colors">
                <Download className="w-4 h-4" />
                Export Logs
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Events", value: totalEvents.toString(), icon: Activity, color: "purple" },
            { label: "Critical Alerts", value: criticalEvents.toString(), icon: XCircle, color: "red" },
            { label: "High Priority", value: highEvents.toString(), icon: AlertTriangle, color: "orange" },
            { label: "Failed Logins", value: failedLogins.toString(), icon: Lock, color: "yellow" },
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
              </div>
              <p className="text-sm text-slate-500 font-sans mb-1">{stat.label}</p>
              <p className="font-serif text-3xl font-bold text-slate-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Security Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white shadow-xl shadow-purple-500/30">
            <div className="flex items-center gap-3 mb-4">
              <UserCog className="w-8 h-8" />
              <h3 className="font-serif text-xl font-bold">Security Settings</h3>
            </div>
            <p className="text-purple-100 mb-4">Configure 2FA requirements, session timeouts, and access controls</p>
            <button className="w-full py-3 rounded-xl bg-white/20 hover:bg-white/30 transition-colors font-semibold">
              Configure
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/30">
            <div className="flex items-center gap-3 mb-4">
              <Fingerprint className="w-8 h-8" />
              <h3 className="font-serif text-xl font-bold">Access Phrases</h3>
            </div>
            <p className="text-blue-100 mb-4">Manage and reset user access phrases</p>
            <button className="w-full py-3 rounded-xl bg-white/20 hover:bg-white/30 transition-colors font-semibold">
              Manage
            </button>
          </div>

          <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-500/30">
            <div className="flex items-center gap-3 mb-4">
              <Server className="w-8 h-8" />
              <h3 className="font-serif text-xl font-bold">System Status</h3>
            </div>
            <p className="text-slate-300 mb-4">View system health and performance metrics</p>
            <button className="w-full py-3 rounded-xl bg-white/20 hover:bg-white/30 transition-colors font-semibold">
              View Status
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-purple-500 bg-white"
              >
                <option value="all">All Severities</option>
                <option value="low">Info</option>
                <option value="medium">Warning</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>

              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-purple-500 bg-white"
              >
                <option value="all">All Events</option>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>{type.replace("_", " ")}</option>
                ))}
              </select>

              <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                {[
                  { id: "1h", label: "1H" },
                  { id: "24h", label: "24H" },
                  { id: "7d", label: "7D" },
                  { id: "30d", label: "30D" },
                ].map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setTimeRange(range.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                      timeRange === range.id
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">Event</th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">User</th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">Details</th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">Severity</th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => {
                  const SeverityIcon = severityConfig[log.severity].icon;
                  return (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-${severityConfig[log.severity].color}-50 flex items-center justify-center`}>
                            <SeverityIcon className={`w-5 h-5 text-${severityConfig[log.severity].color}-600`} />
                          </div>
                          <span className="font-semibold text-slate-900 capitalize">
                            {log.event.replace("_", " ")}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-mono text-slate-600">{log.user}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-slate-600 max-w-2xl">{log.details}</p>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-semibold px-2.5 py-1.5 rounded-full ${
                          log.severity === "low" ? "text-blue-600 bg-blue-50" :
                          log.severity === "medium" ? "text-yellow-600 bg-yellow-50" :
                          log.severity === "high" ? "text-orange-600 bg-orange-50" :
                          "text-red-600 bg-red-50"
                        }`}>
                          {severityConfig[log.severity].label}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-slate-500 font-mono">{log.timestamp}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
