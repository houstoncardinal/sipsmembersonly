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
  Mail,
  Link as LinkIcon,
  Calendar,
  Users,
  Search,
  Download,
  EyeOff,
  X,
  Send,
  ShieldCheck,
} from "lucide-react";

interface EmailPreview {
  recipientEmail: string;
  recipientName: string;
  weeklyCode: string;
}

export default function AdminInvites() {
  const { user, registerMember, initMemberCode, memberCodes } = useAuth();
  const { inviteCodes, createInviteCode, deactivateInviteCode, deleteInviteCode } = useInvite();
  const navigate = useNavigate();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showCreateInvite, setShowCreateInvite] = useState(false);
  const [inviteType, setInviteType] = useState<"single" | "multi">("single");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteMaxUses, setInviteMaxUses] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [emailPreview, setEmailPreview] = useState<EmailPreview | null>(null);

  useEffect(() => {
    if (user?.role !== "admin") navigate("/dashboard");
  }, [user, navigate]);

  if (user?.role !== "admin") return null;

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyField = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCreateInvite = () => {
    if (inviteType === "single") {
      if (!inviteEmail.trim()) return;
      const email = inviteEmail.trim().toLowerCase();
      const name = inviteName.trim() || email;

      // 1. Create the invite record
      createInviteCode("single", email);

      // 2. Register them so they can log in
      registerMember(email, name);

      // 3. Generate their unique access code (or retrieve existing)
      const code = initMemberCode(email);

      // 4. Show email preview with their code
      setEmailPreview({ recipientEmail: email, recipientName: name, weeklyCode: code });
    } else {
      createInviteCode("multi", undefined, inviteMaxUses);
    }

    setShowCreateInvite(false);
    setInviteEmail("");
    setInviteName("");
    setInviteMaxUses(10);
  };

  const getEmailBody = (preview: EmailPreview) => {
    const loginUrl = `${window.location.origin}/auth`;
    return `Hi ${preview.recipientName},

You've been personally invited to join Sips Gettin' Real — an exclusive members-only platform.

Here are your login credentials:

  Email: ${preview.recipientEmail}
  Access Code: ${preview.weeklyCode}

To get in:
  1. Visit ${loginUrl}
  2. Select "Member Access"
  3. Enter your email and the access code above

Your access code is private, unique to you, and single-use — a new one will be sent to you automatically after each login.

Welcome to the circle.

— Sips Gettin' Real`;
  };

  const getMailtoLink = (preview: EmailPreview) => {
    const subject = encodeURIComponent("You're invited to Sips Gettin' Real 🍇");
    const body = encodeURIComponent(getEmailBody(preview));
    return `mailto:${preview.recipientEmail}?subject=${subject}&body=${body}`;
  };

  const filteredInvites = inviteCodes.filter((invite) => {
    const matchSearch =
      invite.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (invite.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = typeFilter === "all" || invite.type === typeFilter;
    return matchSearch && matchType;
  });

  const totalInvites = inviteCodes.length;
  const activeInvites = inviteCodes.filter((i) => i.isActive).length;
  const totalUses = inviteCodes.reduce((sum, i) => sum + i.currentUses, 0);
  const singleUseInvites = inviteCodes.filter((i) => i.type === "single").length;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-4xl text-slate-900 mb-2">Invite Management</h1>
              <p className="text-slate-600">Send personalized invites with auto-generated access codes</p>
            </div>
            <button
              onClick={() => setShowCreateInvite(!showCreateInvite)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl gradient-primary text-white font-sans font-semibold uppercase shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
            >
              <Plus className="w-4 h-4" />
              Send Invite
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Invites", value: totalInvites.toString(), icon: Key, bg: "rgba(124,0,212,0.1)", color: "#7c00d4" },
            { label: "Active Invites", value: activeInvites.toString(), icon: CheckCircle2, bg: "rgba(34,197,94,0.1)", color: "#22c55e" },
            { label: "Total Uses", value: totalUses.toString(), icon: Users, bg: "rgba(59,130,246,0.1)", color: "#3b82f6" },
            { label: "Personal Invites", value: singleUseInvites.toString(), icon: Mail, bg: "rgba(249,115,22,0.1)", color: "#f97316" },
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
                <h3 className="font-serif text-xl text-slate-900 mb-5">Create New Invite</h3>

                {/* Type Selection */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => setInviteType("single")}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      inviteType === "single" ? "border-purple-500 bg-purple-50" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Mail className={`w-6 h-6 mb-2 ${inviteType === "single" ? "text-purple-600" : "text-slate-400"}`} />
                    <p className="font-semibold text-slate-900">Personal Invite</p>
                    <p className="text-xs text-slate-500 mt-1">Sent to one person with their unique access code</p>
                  </button>
                  <button
                    onClick={() => setInviteType("multi")}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      inviteType === "multi" ? "border-purple-500 bg-purple-50" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <LinkIcon className={`w-6 h-6 mb-2 ${inviteType === "multi" ? "text-purple-600" : "text-slate-400"}`} />
                    <p className="font-semibold text-slate-900">Multi-Use Link</p>
                    <p className="text-xs text-slate-500 mt-1">Generic code multiple people can use</p>
                  </button>
                </div>

                {inviteType === "single" ? (
                  <div className="space-y-4 mb-6">
                    {/* Info banner */}
                    <div
                      className="flex items-start gap-3 p-4 rounded-xl text-sm"
                      style={{ background: "rgba(124,0,212,0.05)", border: "1px solid rgba(124,0,212,0.15)" }}
                    >
                      <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#7c00d4" }} />
                      <p className="text-slate-600">
                        A unique weekly access code will be generated for this person. You'll get a ready-to-send email to copy or open in your mail client.
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">Recipient Email *</label>
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="member@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">
                        Recipient Name <span className="font-normal text-slate-400">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={inviteName}
                        onChange={(e) => setInviteName(e.target.value)}
                        placeholder="John Smith"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Maximum Uses</label>
                    <input
                      type="number"
                      value={inviteMaxUses}
                      onChange={(e) => setInviteMaxUses(parseInt(e.target.value) || 1)}
                      min="1"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleCreateInvite}
                    disabled={inviteType === "single" && !inviteEmail.trim()}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl gradient-primary text-white font-semibold uppercase shadow-lg shadow-purple-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {inviteType === "single" ? (
                      <><Send className="w-4 h-4" /> Generate & Preview Email</>
                    ) : (
                      <><Key className="w-4 h-4" /> Generate Code</>
                    )}
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
                placeholder="Search by code or email..."
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
                <option value="single">Personal</option>
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
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">Recipient</th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">Weekly Code</th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">Uses</th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">Created</th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase">Status</th>
                  <th className="text-right p-4 text-xs font-sans font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvites.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-slate-500">
                      <Key className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p>No invite codes yet. Create one to get started.</p>
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
                            onClick={() => copyText(invite.code, invite.id)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            {copiedId === invite.id ? (
                              <Check className="w-3.5 h-3.5 text-green-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-semibold px-2.5 py-1.5 rounded-full ${
                          invite.type === "multi" ? "text-blue-600 bg-blue-50" : "text-purple-600 bg-purple-50"
                        }`}>
                          {invite.type === "multi" ? "Multi-Use" : "Personal"}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        {invite.email || <span className="text-slate-400">—</span>}
                      </td>
                      <td className="p-4">
                        {invite.email ? (() => {
                          const entry = memberCodes[invite.email.toLowerCase()];
                          if (!entry) return <span className="text-xs text-slate-400 italic">not yet generated</span>;
                          return (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-bold" style={{ color: "#7c00d4" }}>
                                  {entry.currentCode}
                                </span>
                                <button
                                  onClick={() => copyField(entry.currentCode, `wc-${invite.id}`)}
                                  className="p-1 rounded-md hover:bg-purple-50 transition-colors"
                                  title="Copy access code"
                                >
                                  {copiedField === `wc-${invite.id}` ? (
                                    <Check className="w-3 h-3 text-green-500" />
                                  ) : (
                                    <Copy className="w-3 h-3 text-slate-400" />
                                  )}
                                </button>
                              </div>
                              <p className="text-[10px] text-slate-400">Single-use · rotates on login</p>
                            </div>
                          );
                        })() : (
                          <span className="text-xs text-slate-400 italic">n/a</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[80px]">
                            <div
                              className="h-full gradient-primary rounded-full"
                              style={{ width: `${Math.min(100, (invite.currentUses / (invite.maxUses || 1)) * 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-slate-600">
                            {invite.currentUses}{invite.maxUses ? `/${invite.maxUses}` : ""}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-500 font-mono">
                        {new Date(invite.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-semibold px-2.5 py-1.5 rounded-full ${
                          invite.isActive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                        }`}>
                          {invite.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {invite.email && invite.isActive && memberCodes[invite.email.toLowerCase()] && (
                            <button
                              onClick={() =>
                                setEmailPreview({
                                  recipientEmail: invite.email!,
                                  recipientName: invite.email!,
                                  weeklyCode: memberCodes[invite.email!.toLowerCase()].currentCode,
                                })
                              }
                              className="p-2 rounded-lg hover:bg-purple-50 transition-colors"
                              title="View / Resend email"
                            >
                              <Mail className="w-4 h-4 text-purple-500" />
                            </button>
                          )}
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

      {/* ── Email Preview Modal ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {emailPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
            onClick={() => setEmailPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                className="px-6 py-5 flex items-center justify-between"
                style={{
                  background: "linear-gradient(135deg, rgba(124,0,212,0.08), rgba(212,0,170,0.05))",
                  borderBottom: "1px solid rgba(124,0,212,0.12)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #7c00d4, #d400aa)" }}
                  >
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-slate-900">Invite Email Ready</h3>
                    <p className="text-xs text-slate-500">{emailPreview.recipientEmail}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEmailPreview(null)}
                  className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Access Code Highlight */}
                <div
                  className="rounded-2xl p-4 flex items-center justify-between"
                  style={{
                    background: "linear-gradient(135deg, rgba(124,0,212,0.06), rgba(212,0,170,0.04))",
                    border: "1px solid rgba(124,0,212,0.15)",
                  }}
                >
                  <div>
                    <p className="text-xs text-slate-500 font-sans mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" style={{ color: "#7c00d4" }} />
                      Their weekly access code
                    </p>
                    <p className="font-mono text-2xl font-bold tracking-widest" style={{ color: "#7c00d4" }}>
                      {emailPreview.weeklyCode}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Single-use · rotates after each login
                    </p>
                  </div>
                  <button
                    onClick={() => copyField(emailPreview.weeklyCode, "modal-code")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: copiedField === "modal-code" ? "rgba(34,197,94,0.1)" : "rgba(124,0,212,0.1)",
                      color: copiedField === "modal-code" ? "#22c55e" : "#7c00d4",
                      border: `1px solid ${copiedField === "modal-code" ? "rgba(34,197,94,0.2)" : "rgba(124,0,212,0.2)"}`,
                    }}
                  >
                    {copiedField === "modal-code" ? (
                      <><Check className="w-3.5 h-3.5" /> Copied!</>
                    ) : (
                      <><Copy className="w-3.5 h-3.5" /> Copy Code</>
                    )}
                  </button>
                </div>

                {/* Email Body Preview */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Preview</p>
                  <div
                    className="rounded-xl p-4 font-mono text-xs text-slate-700 leading-relaxed max-h-52 overflow-y-auto"
                    style={{ background: "#f8f9fa", border: "1px solid #eaecf0", whiteSpace: "pre-wrap" }}
                  >
                    {getEmailBody(emailPreview)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-1">
                  <a
                    href={getMailtoLink(emailPreview)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all shadow-lg shadow-purple-500/30"
                    style={{ background: "linear-gradient(135deg, #7c00d4, #d400aa)" }}
                  >
                    <Send className="w-4 h-4" />
                    Open in Mail App
                  </a>
                  <button
                    onClick={() => copyField(getEmailBody(emailPreview), "modal-body")}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: copiedField === "modal-body" ? "rgba(34,197,94,0.08)" : "rgba(124,0,212,0.07)",
                      color: copiedField === "modal-body" ? "#22c55e" : "#7c00d4",
                      border: `1px solid ${copiedField === "modal-body" ? "rgba(34,197,94,0.2)" : "rgba(124,0,212,0.15)"}`,
                    }}
                  >
                    {copiedField === "modal-body" ? (
                      <><Check className="w-4 h-4" /> Copied!</>
                    ) : (
                      <><Copy className="w-4 h-4" /> Copy Email</>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-center text-slate-400">
                  This member is now registered and can log in immediately with the code above.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
