import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, generateWeeklyCode, getHoursUntilReset } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Crown,
  DollarSign,
  ShoppingBag,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Copy,
  Check,
  KeyRound,
} from "lucide-react";

interface Member {
  id: string;
  email: string;
  name: string;
  role: "admin" | "member";
  status: "active" | "inactive" | "suspended";
  lastLogin: string;
  joinedAt: string;
  orders: number;
  totalSpent: number;
}

const mockMembers: Member[] = [
  {
    id: "1",
    email: "admin@sipsgettinreal.test",
    name: "Admin User",
    role: "admin",
    status: "active",
    lastLogin: "2025-02-19 14:30",
    joinedAt: "2025-01-01",
    orders: 15,
    totalSpent: 12500,
  },
  {
    id: "2",
    email: "member@sipsgettinreal.test",
    name: "Member User",
    role: "member",
    status: "active",
    lastLogin: "2025-02-18 10:15",
    joinedAt: "2025-01-15",
    orders: 3,
    totalSpent: 2100,
  },
  {
    id: "3",
    email: "vip@example.com",
    name: "VIP Customer",
    role: "member",
    status: "active",
    lastLogin: "2025-02-17 16:45",
    joinedAt: "2025-02-01",
    orders: 1,
    totalSpent: 4500,
  },
  {
    id: "4",
    email: "inactive@example.com",
    name: "Inactive User",
    role: "member",
    status: "inactive",
    lastLogin: "2025-01-20 09:00",
    joinedAt: "2025-01-10",
    orders: 0,
    totalSpent: 0,
  },
];

function WeeklyCodeCell({ email, role }: { email: string; role: "admin" | "member" }) {
  const [copied, setCopied] = useState(false);
  const hoursLeft = getHoursUntilReset();
  const daysLeft = Math.ceil(hoursLeft / 24);

  if (role === "admin") {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-slate-400 font-mono italic">master key</span>
      </div>
    );
  }

  const code = generateWeeklyCode(email);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span
          className="font-mono text-sm font-bold tracking-widest"
          style={{ color: "#7c00d4" }}
        >
          {code}
        </span>
        <button
          onClick={handleCopy}
          className="p-1 rounded-md transition-all hover:bg-purple-50"
          title="Copy code"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-400 hover:text-purple-500" />
          )}
        </button>
      </div>
      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-sans">
        <Clock className="w-2.5 h-2.5" />
        Resets in {daysLeft}d {hoursLeft % 24}h
      </div>
    </div>
  );
}

export default function AdminMembers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useState(() => {
    if (user?.role !== "admin") navigate("/dashboard");
  });

  if (user?.role !== "admin") return null;

  const filteredMembers = members.filter((member) => {
    const matchSearch =
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === "all" || member.role === roleFilter;
    const matchStatus = statusFilter === "all" || member.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === "active").length;
  const adminCount = members.filter((m) => m.role === "admin").length;
  const totalRevenue = members.reduce((sum, m) => sum + m.totalSpent, 0);

  const handleToggleStatus = (member: Member) => {
    setMembers(
      members.map((m) =>
        m.id === member.id
          ? { ...m, status: m.status === "active" ? "suspended" : "active" }
          : m
      )
    );
  };

  const handleDeleteMember = (id: string) => {
    if (confirm("Are you sure you want to delete this member?")) {
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-4xl text-slate-900 mb-2">Member Management</h1>
              <p className="text-slate-600">Manage members and their weekly access codes</p>
            </div>
            <button className="flex items-center gap-2 px-5 py-3 rounded-xl gradient-primary text-white font-sans font-semibold uppercase shadow-lg shadow-purple-500/30">
              <Plus className="w-4 h-4" />
              Add Member
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Members", value: totalMembers.toString(), icon: Users, color: "purple" },
            { label: "Active Members", value: activeMembers.toString(), icon: CheckCircle2, color: "green" },
            { label: "Administrators", value: adminCount.toString(), icon: Crown, color: "blue" },
            {
              label: "Total Revenue",
              value: `$${(totalRevenue / 1000).toFixed(1)}K`,
              icon: DollarSign,
              color: "green",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center`}
                  style={{
                    background:
                      stat.color === "purple"
                        ? "rgba(124,0,212,0.1)"
                        : stat.color === "blue"
                        ? "rgba(59,130,246,0.1)"
                        : "rgba(34,197,94,0.1)",
                  }}
                >
                  <stat.icon
                    className="w-6 h-6"
                    style={{
                      color:
                        stat.color === "purple"
                          ? "#7c00d4"
                          : stat.color === "blue"
                          ? "#3b82f6"
                          : "#22c55e",
                    }}
                  />
                </div>
              </div>
              <p className="text-sm text-slate-500 font-sans mb-1">{stat.label}</p>
              <p className="font-serif text-3xl font-bold text-slate-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Weekly Code Info Banner */}
        <div
          className="rounded-2xl p-4 mb-6 flex items-center gap-3"
          style={{
            background: "linear-gradient(135deg, rgba(124,0,212,0.06), rgba(212,0,170,0.04))",
            border: "1px solid rgba(124,0,212,0.15)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(124,0,212,0.1)" }}
          >
            <KeyRound className="w-5 h-5" style={{ color: "#7c00d4" }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 font-sans">
              Weekly Rotating Access Codes
            </p>
            <p className="text-xs text-slate-500 font-sans">
              Each member's code is unique and rotates automatically every 7 days. Copy a code to
              share it with the member securely. Codes reset in{" "}
              <span className="font-semibold" style={{ color: "#7c00d4" }}>
                {Math.ceil(getHoursUntilReset() / 24)}d {getHoursUntilReset() % 24}h
              </span>
              .
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-purple-500 bg-white"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="member">Member</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-purple-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">
                    Member
                  </th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">
                    Role
                  </th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">
                    Status
                  </th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">
                    Weekly Code
                  </th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">
                    Orders
                  </th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">
                    Total Spent
                  </th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">
                    Last Active
                  </th>
                  <th className="text-right p-4 text-xs font-sans font-semibold text-slate-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                          {member.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{member.name}</p>
                          <p className="text-sm text-slate-500">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          member.role === "admin"
                            ? "text-purple-600 bg-purple-50"
                            : "text-slate-600 bg-slate-100"
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          member.status === "active"
                            ? "text-green-600 bg-green-50"
                            : member.status === "suspended"
                            ? "text-red-600 bg-red-50"
                            : "text-slate-600 bg-slate-100"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <WeeklyCodeCell email={member.email} role={member.role} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">{member.orders}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-serif font-bold text-slate-900">
                        ${member.totalSpent.toLocaleString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-slate-600 font-mono">{member.lastLogin}</p>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(member)}
                          className={`p-2 rounded-lg transition-colors ${
                            member.status === "active"
                              ? "hover:bg-orange-50 text-orange-500"
                              : "hover:bg-green-50 text-green-500"
                          }`}
                          title={member.status === "active" ? "Suspend" : "Activate"}
                        >
                          {member.status === "active" ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
