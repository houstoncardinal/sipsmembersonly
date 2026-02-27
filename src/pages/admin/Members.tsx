import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, generateRandomCode, MemberCodeEntry } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Plus,
  CheckCircle2,
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
  Mail,
  Send,
  X,
  Bell,
  RefreshCw,
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
    email: "sipsgettingr@gmail.com",
    name: "Sips Admin",
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

interface EmailModalData {
  memberName: string;
  memberEmail: string;
  code: string;
  isNewCode: boolean;
}

function getEmailBody(data: EmailModalData): string {
  const loginUrl = `${window.location.origin}/auth`;
  return `Hi ${data.memberName},

${data.isNewCode
    ? "Your previous access code was used to log in. Here is your new private access code for next time:"
    : "Here is your private access code to log in to Sips Getting Real:"}

  Email: ${data.memberEmail}
  Access Code: ${data.code}

To log in:
  1. Visit ${loginUrl}
  2. Select "Member Access"
  3. Enter your email and the access code above

Your code is single-use and will be replaced with a fresh one after each login.

Welcome to the circle.

— Sips Getting Real`;
}

function CodeCell({
  member,
  entry,
  onInit,
  onSendEmail,
}: {
  member: Member;
  entry: MemberCodeEntry | undefined;
  onInit: () => void;
  onSendEmail: () => void;
}) {
  const [copied, setCopied] = useState(false);

  if (member.role === "admin") {
    return <span className="text-xs text-slate-400 font-mono italic">master key</span>;
  }

  if (!entry) {
    return (
      <button
        onClick={onInit}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:shadow-sm"
        style={{ background: "rgba(124,0,212,0.07)", color: "#7c00d4", border: "1px solid rgba(124,0,212,0.15)" }}
      >
        <RefreshCw className="w-3 h-3" />
        Generate Code
      </button>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(entry.currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex flex-col gap-1.5">
      {/* Pending notify badge */}
      {entry.pendingNotify && (
        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold w-fit"
          style={{ background: "rgba(239,68,68,0.1)", color: "#dc2626", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          <Bell className="w-2.5 h-2.5" />
          New code — notify member
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-bold tracking-widest" style={{ color: "#7c00d4" }}>
          {entry.currentCode}
        </span>
        <button onClick={handleCopy} className="p-1 rounded-md hover:bg-purple-50 transition-colors" title="Copy">
          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
        </button>
        <button onClick={onSendEmail} className="p-1 rounded-md hover:bg-purple-50 transition-colors" title="Send email">
          <Mail className="w-3.5 h-3.5 text-purple-400" />
        </button>
      </div>

      {entry.lastUsedAt && (
        <p className="text-[10px] text-slate-400">
          Last used {new Date(entry.lastUsedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

export default function AdminMembers() {
  const { user, memberCodes, initMemberCode, clearNotify } = useAuth();
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [emailModal, setEmailModal] = useState<EmailModalData | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== "admin") navigate("/dashboard");
  }, [user, navigate]);

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
  const pendingNotifyCount = Object.values(memberCodes).filter((e) => e.pendingNotify).length;

  const handleToggleStatus = (member: Member) => {
    setMembers(members.map((m) =>
      m.id === member.id ? { ...m, status: m.status === "active" ? "suspended" : "active" } : m
    ));
  };

  const handleDeleteMember = (id: string) => {
    if (confirm("Are you sure you want to delete this member?")) {
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  const handleInitCode = (member: Member) => {
    const code = initMemberCode(member.email);
    setEmailModal({ memberName: member.name, memberEmail: member.email, code, isNewCode: false });
  };

  const handleSendEmail = (member: Member) => {
    const entry = memberCodes[member.email.toLowerCase()];
    if (!entry) return;
    setEmailModal({
      memberName: member.name,
      memberEmail: member.email,
      code: entry.currentCode,
      isNewCode: entry.pendingNotify,
    });
    clearNotify(member.email);
  };

  const copyField = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-4xl text-slate-900 mb-2">Member Management</h1>
              <p className="text-slate-600">Access codes rotate automatically after every login</p>
            </div>
            <button className="flex items-center gap-2 px-5 py-3 rounded-xl gradient-primary text-white font-sans font-semibold uppercase shadow-lg shadow-purple-500/30">
              <Plus className="w-4 h-4" />
              Add Member
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Members", value: totalMembers.toString(), icon: Users, bg: "rgba(124,0,212,0.1)", color: "#7c00d4" },
            { label: "Active Members", value: activeMembers.toString(), icon: CheckCircle2, bg: "rgba(34,197,94,0.1)", color: "#22c55e" },
            { label: "Administrators", value: adminCount.toString(), icon: Crown, bg: "rgba(59,130,246,0.1)", color: "#3b82f6" },
            { label: "Pending Notify", value: pendingNotifyCount.toString(), icon: Bell, bg: "rgba(239,68,68,0.1)", color: "#dc2626" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: stat.bg }}>
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <p className="text-sm text-slate-500 font-sans mb-1">{stat.label}</p>
              <p className="font-serif text-3xl font-bold text-slate-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Pending notify banner */}
        {pendingNotifyCount > 0 && (
          <div
            className="rounded-2xl p-4 mb-6 flex items-center gap-3"
            style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(239,68,68,0.1)" }}>
              <Bell className="w-4 h-4" style={{ color: "#dc2626" }} />
            </div>
            <p className="text-sm text-slate-700 font-sans">
              <span className="font-semibold" style={{ color: "#dc2626" }}>{pendingNotifyCount} member{pendingNotifyCount > 1 ? "s" : ""}</span> logged in and now have a new access code waiting — click the{" "}
              <Mail className="w-3.5 h-3.5 inline" style={{ color: "#7c00d4" }} /> mail icon to send it to them.
            </p>
          </div>
        )}

        {/* Info banner */}
        <div
          className="rounded-2xl p-4 mb-6 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg, rgba(124,0,212,0.06), rgba(212,0,170,0.04))", border: "1px solid rgba(124,0,212,0.15)" }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(124,0,212,0.1)" }}>
            <KeyRound className="w-5 h-5" style={{ color: "#7c00d4" }} />
          </div>
          <p className="text-sm text-slate-600 font-sans">
            Each member has a <span className="font-semibold text-slate-800">single-use access code</span>. When they log in, the code is consumed and a new one is generated automatically. Send the new code to them via the mail icon.
          </p>
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
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-purple-500 bg-white">
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="member">Member</option>
              </select>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-purple-500 bg-white">
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

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">Member</th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">Role</th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">Status</th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">Access Code</th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">Orders</th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">Total Spent</th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">Last Active</th>
                  <th className="text-right p-4 text-xs font-sans font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-50 transition-colors"
                    style={memberCodes[member.email.toLowerCase()]?.pendingNotify ? { background: "rgba(239,68,68,0.02)" } : {}}
                  >
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
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        member.role === "admin" ? "text-purple-600 bg-purple-50" : "text-slate-600 bg-slate-100"
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        member.status === "active" ? "text-green-600 bg-green-50" :
                        member.status === "suspended" ? "text-red-600 bg-red-50" : "text-slate-600 bg-slate-100"
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <CodeCell
                        member={member}
                        entry={memberCodes[member.email.toLowerCase()]}
                        onInit={() => handleInitCode(member)}
                        onSendEmail={() => handleSendEmail(member)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">{member.orders}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-serif font-bold text-slate-900">${member.totalSpent.toLocaleString()}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-slate-600 font-mono">{member.lastLogin}</p>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(member)}
                          className={`p-2 rounded-lg transition-colors ${
                            member.status === "active" ? "hover:bg-orange-50 text-orange-500" : "hover:bg-green-50 text-green-500"
                          }`}
                          title={member.status === "active" ? "Suspend" : "Activate"}
                        >
                          {member.status === "active" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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

      {/* ── Email Modal ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {emailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
            onClick={() => setEmailModal(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="px-6 py-5 flex items-center justify-between"
                style={{ background: "linear-gradient(135deg, rgba(124,0,212,0.07), rgba(212,0,170,0.04))", borderBottom: "1px solid rgba(124,0,212,0.12)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c00d4, #d400aa)" }}>
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-slate-900">
                      {emailModal.isNewCode ? "New Code Ready to Send" : "Access Code Email"}
                    </h3>
                    <p className="text-xs text-slate-500">{emailModal.memberEmail}</p>
                  </div>
                </div>
                <button onClick={() => setEmailModal(null)} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Code highlight */}
                <div
                  className="rounded-2xl p-4 flex items-center justify-between"
                  style={{ background: "linear-gradient(135deg, rgba(124,0,212,0.06), rgba(212,0,170,0.03))", border: "1px solid rgba(124,0,212,0.15)" }}
                >
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Their access code</p>
                    <p className="font-mono text-2xl font-bold tracking-widest" style={{ color: "#7c00d4" }}>
                      {emailModal.code}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">Single-use — rotates after next login</p>
                  </div>
                  <button
                    onClick={() => copyField(emailModal.code, "code")}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: copiedField === "code" ? "rgba(34,197,94,0.1)" : "rgba(124,0,212,0.1)",
                      color: copiedField === "code" ? "#22c55e" : "#7c00d4",
                      border: `1px solid ${copiedField === "code" ? "rgba(34,197,94,0.2)" : "rgba(124,0,212,0.2)"}`,
                    }}
                  >
                    {copiedField === "code" ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                  </button>
                </div>

                {/* Email preview */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Preview</p>
                  <div
                    className="rounded-xl p-4 font-mono text-xs text-slate-700 leading-relaxed max-h-48 overflow-y-auto"
                    style={{ background: "#f8f9fa", border: "1px solid #eaecf0", whiteSpace: "pre-wrap" }}
                  >
                    {getEmailBody(emailModal)}
                  </div>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`mailto:${emailModal.memberEmail}?subject=${encodeURIComponent("Your new access code — Sips Getting Real")}&body=${encodeURIComponent(getEmailBody(emailModal))}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white shadow-lg shadow-purple-500/30"
                    style={{ background: "linear-gradient(135deg, #7c00d4, #d400aa)" }}
                  >
                    <Send className="w-4 h-4" />
                    Open in Mail App
                  </a>
                  <button
                    onClick={() => copyField(getEmailBody(emailModal), "body")}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: copiedField === "body" ? "rgba(34,197,94,0.08)" : "rgba(124,0,212,0.07)",
                      color: copiedField === "body" ? "#22c55e" : "#7c00d4",
                      border: `1px solid ${copiedField === "body" ? "rgba(34,197,94,0.2)" : "rgba(124,0,212,0.15)"}`,
                    }}
                  >
                    {copiedField === "body" ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Email</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
