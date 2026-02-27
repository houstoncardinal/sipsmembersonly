import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import {
  Shield,
  KeyRound,
  Smartphone,
  Lock,
  MessageSquare,
  Plus,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Ticket,
  Mail,
  User,
  AtSign,
  Crown,
} from "lucide-react";

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: string;
  replies: number;
}

const mockTickets: SupportTicket[] = [
  {
    id: "TKT-001",
    subject: "Question about shipping times",
    message: "When will my order ship? I placed it 3 days ago.",
    status: "resolved",
    createdAt: "2025-02-10",
    replies: 2,
  },
  {
    id: "TKT-002",
    subject: "Payment confirmation delay",
    message: "My Bitcoin payment shows 1 confirmation but order still shows confirming.",
    status: "in_progress",
    createdAt: "2025-02-15",
    replies: 1,
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  open: { label: "Open", color: "blue", icon: AlertCircle },
  in_progress: { label: "In Progress", color: "yellow", icon: Clock },
  resolved: { label: "Resolved", color: "green", icon: CheckCircle2 },
  closed: { label: "Closed", color: "slate", icon: CheckCircle2 },
};

export default function Account() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "support">("profile");
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating ticket:", { subject: ticketSubject, message: ticketMessage });
    setShowNewTicket(false);
    setTicketSubject("");
    setTicketMessage("");
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-slate-900 mb-2">My Account</h1>
          <p className="text-slate-600">Manage your profile and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-200">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "security", label: "Security", icon: Shield },
            { id: "support", label: "Support", icon: MessageSquare },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-sans font-semibold uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Profile Card */}
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-6">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-purple-500/30"
                  >
                    {user?.name?.[0]}
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="font-serif text-2xl text-slate-900">{user?.name}</h2>
                      {user?.role === "admin" && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-purple-100 text-purple-600">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 flex items-center gap-2">
                      <AtSign className="w-4 h-4" />
                      {user?.email}
                    </p>
                  </div>
                  <button className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors">
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="font-serif text-xl text-slate-900">Account Information</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {[
                    { label: "Email Address", value: user?.email, icon: AtSign },
                    { label: "Account Type", value: user?.role === "admin" ? "Administrator" : "Member", icon: Crown },
                    { label: "Member Since", value: "January 2025", icon: Clock },
                  ].map((item) => (
                    <div key={item.label} className="p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-500 mb-1">{item.label}</p>
                        <p className="font-semibold text-slate-900">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="font-serif text-xl text-slate-900 flex items-center gap-3">
                    <Lock className="w-5 h-5 text-purple-500" />
                    Security Settings
                  </h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {[
                    {
                      icon: Lock,
                      label: "Password",
                      description: "Last changed 30 days ago",
                      action: "Change",
                      color: "purple",
                    },
                    {
                      icon: KeyRound,
                      label: "Access Phrase",
                      description: "Your secret access phrase is active",
                      action: "Reset",
                      color: "blue",
                    },
                    {
                      icon: Smartphone,
                      label: "Two-Factor Authentication",
                      description: "Add an extra layer of security",
                      action: "Enable",
                      color: "green",
                    },
                  ].map((item) => (
                    <div key={item.label} className="p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                      <div className={`w-12 h-12 rounded-xl bg-${item.color}-50 flex items-center justify-center`}>
                        <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{item.label}</p>
                        <p className="text-sm text-slate-500">{item.description}</p>
                      </div>
                      <button className={`px-5 py-2.5 rounded-lg bg-${item.color}-50 text-${item.color}-600 font-semibold hover:bg-${item.color}-100 transition-colors`}>
                        {item.action}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Support Tab */}
          {activeTab === "support" && (
            <motion.div
              key="support"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Create Ticket Button */}
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl text-slate-900">Support Tickets</h2>
                <button
                  onClick={() => setShowNewTicket(!showNewTicket)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl gradient-primary text-white font-sans font-semibold uppercase shadow-lg shadow-purple-500/30"
                >
                  <Plus className="w-4 h-4" />
                  New Ticket
                </button>
              </div>

              {/* New Ticket Form */}
              <AnimatePresence>
                {showNewTicket && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <form onSubmit={handleCreateTicket} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                      <h3 className="font-serif text-lg text-slate-900">Create Support Ticket</h3>
                      <div>
                        <label className="text-sm font-semibold text-slate-700 mb-2 block">Subject</label>
                        <input
                          type="text"
                          value={ticketSubject}
                          onChange={(e) => setTicketSubject(e.target.value)}
                          placeholder="Brief description of your issue"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-slate-700 mb-2 block">Message</label>
                        <textarea
                          value={ticketMessage}
                          onChange={(e) => setTicketMessage(e.target.value)}
                          placeholder="Describe your issue in detail..."
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 min-h-[120px]"
                          required
                        />
                      </div>
                      <div className="flex gap-3">
                        <button type="submit" className="flex-1 gradient-primary text-white py-3 rounded-xl font-semibold uppercase shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2">
                          <Send className="w-4 h-4" />
                          Submit Ticket
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNewTicket(false)}
                          className="px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tickets List */}
              <div className="space-y-3">
                {mockTickets.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                    <Ticket className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <p className="text-slate-500">No support tickets yet.</p>
                  </div>
                ) : (
                  mockTickets.map((ticket, i) => {
                    const StatusIcon = statusConfig[ticket.status].icon;
                    const isExpanded = selectedTicket === ticket.id;

                    return (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                      >
                        <div
                          className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
                          onClick={() => setSelectedTicket(isExpanded ? null : ticket.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                                <MessageSquare className="w-5 h-5 text-purple-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-900 truncate">{ticket.subject}</h3>
                                <p className="text-sm text-slate-500">{ticket.createdAt}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-${statusConfig[ticket.status].color}-50 ${statusConfig[ticket.status].color.replace('slate', 'slate')}-600`}>
                                <StatusIcon className={`w-4 h-4 text-${statusConfig[ticket.status].color}-600`} />
                                <span className="text-xs font-bold uppercase">{statusConfig[ticket.status].label}</span>
                              </div>
                              {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                            </div>
                          </div>
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="border-t border-slate-100 p-6 space-y-4">
                                <div>
                                  <p className="text-sm font-semibold text-slate-700 mb-2">Issue Description</p>
                                  <p className="text-slate-600 leading-relaxed">{ticket.message}</p>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {ticket.replies} {ticket.replies === 1 ? "reply" : "replies"}
                                  </span>
                                  <span>Ticket ID: {ticket.id}</span>
                                </div>
                                <div className="flex gap-2 pt-3">
                                  <button className="px-5 py-2.5 rounded-lg bg-purple-50 text-purple-600 font-semibold hover:bg-purple-100 transition-colors">
                                    Reply
                                  </button>
                                  {ticket.status !== "closed" && (
                                    <button className="px-5 py-2.5 rounded-lg bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition-colors">
                                      Close Ticket
                                    </button>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
