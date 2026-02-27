import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useInvite } from "@/context/InviteContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  Key,
  Plus,
  Copy,
  Check,
  CheckCircle2,
  Trash2,
  XCircle,
  Mail,
  Link as LinkIcon,
  Calendar,
  TrendingUp,
  Users,
  Shield,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AdminInvites() {
  const { user } = useAuth();
  const { inviteCodes, createInviteCode, deactivateInviteCode, deleteInviteCode } = useInvite();
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreateInvite, setShowCreateInvite] = useState(false);
  const [inviteType, setInviteType] = useState<"single" | "multi">("multi");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMaxUses, setInviteMaxUses] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    if (user?.role !== "admin") navigate("/dashboard");
  }, [user, navigate]);

  if (user?.role !== "admin") return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateInvite = () => {
    const email = inviteType === "single" ? inviteEmail : undefined;
    const maxUses = inviteType === "multi" ? inviteMaxUses : undefined;
    createInviteCode(inviteType, email, maxUses);
    setShowCreateInvite(false);
    setInviteEmail("");
    setInviteMaxUses(10);
  };

  const filteredInvites = inviteCodes.filter((invite) => {
    const matchSearch = invite.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = typeFilter === "all" || invite.type === typeFilter;
    return matchSearch && matchType;
  });

  // Stats
  const totalInvites = inviteCodes.length;
  const activeInvites = inviteCodes.filter((i) => i.isActive).length;
  const totalUses = inviteCodes.reduce((sum, i) => sum + i.currentUses, 0);
  const multiUseInvites = inviteCodes.filter((i) => i.type === "multi").length;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-4xl text-slate-900 mb-2">Invite Management</h1>
              <p className="text-slate-600">Create and manage exclusive invite codes</p>
            </div>
            <button
              onClick={() => setShowCreateInvite(!showCreateInvite)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl gradient-primary text-white font-sans font-semibold uppercase shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Invite
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Invites", value: totalInvites.toString(), icon: Key, color: "purple" },
            { label: "Active Invites", value: activeInvites.toString(), icon: CheckCircle2, color: "green" },
            { label: "Total Uses", value: totalUses.toString(), icon: Users, color: "blue" },
            { label: "Multi-Use Codes", value: multiUseInvites.toString(), icon: LinkIcon, color: "orange" },
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

        {/* Create Invite Form */}
        <AnimatePresence>
          {showCreateInvite && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-serif text-lg text-slate-900 mb-4">Create New Invite</h3>
                
                {/* Type Selection */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => setInviteType("multi")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      inviteType === "multi"
                        ? "border-purple-500 bg-purple-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <LinkIcon className={`w-6 h-6 mb-2 ${inviteType === "multi" ? "text-purple-600" : "text-slate-400"}`} />
                    <p className="font-semibold text-slate-900">Multi-Use Link</p>
                    <p className="text-xs text-slate-500 mt-1">Multiple people can use this code</p>
                  </button>
                  <button
                    onClick={() => setInviteType("single")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      inviteType === "single"
                        ? "border-purple-500 bg-purple-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Mail className={`w-6 h-6 mb-2 ${inviteType === "single" ? "text-purple-600" : "text-slate-400"}`} />
                    <p className="font-semibold text-slate-900">Email-Specific</p>
                    <p className="text-xs text-slate-500 mt-1">Single user only, tied to email</p>
                  </button>
                </div>

                {/* Conditional Inputs */}
                {inviteType === "single" ? (
                  <div className="mb-6">
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Recipient Email
                    </label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                ) : (
                  <div className="mb-6">
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Maximum Uses
                    </label>
                    <input
                      type="number"
                      value={inviteMaxUses}
                      onChange={(e) => setInviteMaxUses(parseInt(e.target.value) || 0)}
                      min="1"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCreateInvite}
                    className="flex-1 py-3 rounded-xl gradient-primary text-white font-semibold uppercase shadow-lg shadow-purple-500/30"
                  >
                    Generate Code
                  </button>
                  <button
                    onClick={() => setShowCreateInvite(false)}
                    className="px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search invite codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-purple-500 bg-white"
              >
                <option value="all">All Types</option>
                <option value="multi">Multi-Use</option>
                <option value="single">Single-Use</option>
              </select>

              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Invite Codes Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">Code</th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">Type</th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">Email</th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">Uses</th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">Created</th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">Status</th>
                  <th className="text-right p-4 text-xs font-sans font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvites.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-500">
                      <Key className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p>No invite codes found. Create one to get started.</p>
                    </td>
                  </tr>
                ) : (
                  filteredInvites.map((invite) => (
                    <tr key={invite.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg">
                            {invite.code}
                          </code>
                          <button
                            onClick={() => copyToClipboard(invite.code, invite.id)}
                            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            {copiedId === invite.id ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-semibold px-2.5 py-1.5 rounded-full ${
                          invite.type === "multi"
                            ? "text-blue-600 bg-blue-50"
                            : "text-purple-600 bg-purple-50"
                        }`}>
                          {invite.type === "multi" ? "Multi-Use" : "Single-Use"}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        {invite.email || (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[100px]">
                            <div 
                              className="h-full gradient-primary rounded-full"
                              style={{ width: `${Math.min(100, (invite.currentUses / (invite.maxUses || 1)) * 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-slate-600">
                            {invite.currentUses}{invite.maxUses ? `/${invite.maxUses}` : ''}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-500 font-mono">
                        {new Date(invite.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-semibold px-2.5 py-1.5 rounded-full ${
                          invite.isActive
                            ? "text-green-600 bg-green-50"
                            : "text-red-600 bg-red-50"
                        }`}>
                          {invite.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {invite.isActive ? (
                            <button
                              onClick={() => deactivateInviteCode(invite.id)}
                              className="p-2 rounded-lg hover:bg-orange-50 transition-colors"
                              title="Deactivate"
                            >
                              <EyeOff className="w-4 h-4 text-orange-500" />
                            </button>
                          ) : (
                            <button
                              onClick={() => deleteInviteCode(invite.id)}
                              className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
