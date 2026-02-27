import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useMessages, Message } from "@/context/MessageContext";
import {
  MessageSquare,
  Send,
  Plus,
  Search,
  Mail,
  Clock,
  CheckCircle2,
  Archive,
  Trash2,
  ChevronLeft,
  Reply,
  User,
  Crown,
  X,
} from "lucide-react";

export default function Messages() {
  const { user } = useAuth();
  const { messages, getUserMessages, sendMessage, markAsRead, deleteMessage } = useMessages();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newContent, setNewContent] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "sent">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const userMessages = getUserMessages(user?.email || "");
  
  const filteredMessages = userMessages.filter((msg) => {
    const matchFilter = 
      filter === "all" ||
      (filter === "unread" && !msg.read && msg.to === user?.email) ||
      (filter === "sent" && msg.from === user?.email);
    
    const matchSearch = 
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchFilter && matchSearch;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newContent.trim()) return;
    
    // Send to admin
    sendMessage("admin@sipsgettinreal.test", newSubject, newContent);
    setNewSubject("");
    setNewContent("");
    setShowNewMessage(false);
  };

  const handleReply = (content: string) => {
    const replySubject = `Re: ${selectedMessage?.subject}`;
    setNewSubject(replySubject);
    setNewContent(content);
    setShowNewMessage(true);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-4xl text-slate-900 mb-2">Messages</h1>
              <p className="text-slate-600">Private communication with the shop owner</p>
            </div>
            <button
              onClick={() => setShowNewMessage(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl gradient-primary text-white font-sans font-semibold uppercase shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
            >
              <Plus className="w-4 h-4" />
              New Message
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-1 space-y-4">
            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm"
                />
              </div>
              <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                {[
                  { id: "all", label: "All" },
                  { id: "unread", label: "Unread" },
                  { id: "sent", label: "Sent" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id as any)}
                    className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                      filter === f.id
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="space-y-2">
              {filteredMessages.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p className="text-slate-500">No messages found</p>
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (msg.to === user?.email && !msg.read) {
                        markAsRead(msg.id);
                      }
                    }}
                    className={`bg-white rounded-xl p-4 border cursor-pointer transition-all ${
                      selectedMessage?.id === msg.id
                        ? "border-purple-300 shadow-md shadow-purple-100"
                        : "border-slate-200 hover:border-purple-200"
                    } ${!msg.read && msg.to === user?.email ? "bg-purple-50/50" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.isSystem ? "bg-gradient-to-br from-purple-500 to-purple-700" :
                        msg.from === user?.email ? "bg-slate-200" : "bg-purple-100"
                      }`}>
                        {msg.isSystem ? (
                          <Crown className="w-5 h-5 text-white" />
                        ) : msg.from === user?.email ? (
                          <User className="w-5 h-5 text-slate-600" />
                        ) : (
                          <Crown className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-semibold text-sm truncate ${
                            !msg.read && msg.to === user?.email ? "text-slate-900" : "text-slate-700"
                          }`}>
                            {msg.subject}
                          </h3>
                          {!msg.read && msg.to === user?.email && (
                            <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate mb-1">{msg.content}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <Clock className="w-3 h-3" />
                          {new Date(msg.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedMessage.isSystem || selectedMessage.from === "admin@sipsgettinreal.test"
                          ? "bg-gradient-to-br from-purple-500 to-purple-700"
                          : "bg-slate-200"
                      }`}>
                        {selectedMessage.isSystem || selectedMessage.from === "admin@sipsgettinreal.test" ? (
                          <Crown className="w-6 h-6 text-white" />
                        ) : (
                          <User className="w-6 h-6 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <h2 className="font-serif text-xl text-slate-900">{selectedMessage.subject}</h2>
                        <p className="text-sm text-slate-500">
                          From: {selectedMessage.from === user?.email ? "You" : "Shop Owner"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(selectedMessage.timestamp).toLocaleString()}
                    </span>
                    {selectedMessage.read && (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        Read
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.content}
                  </p>
                </div>

                {/* Reply Button */}
                {selectedMessage.from !== user?.email && (
                  <div className="p-6 border-t border-slate-100">
                    <button
                      onClick={() => handleReply("")}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl gradient-primary text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
                    >
                      <Reply className="w-4 h-4" />
                      Reply
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-6 text-slate-300" />
                <h3 className="font-serif text-2xl text-slate-900 mb-2">Select a message</h3>
                <p className="text-slate-500">Choose a message from the list to read or reply</p>
              </div>
            )}
          </div>
        </div>

        {/* New Message Modal */}
        <AnimatePresence>
          {showNewMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={() => setShowNewMessage(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="font-serif text-2xl text-slate-900">New Message</h2>
                  <button
                    onClick={() => setShowNewMessage(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleSendMessage} className="p-6 space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">To</label>
                    <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
                      Shop Owner (admin@sipsgettinreal.test)
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Subject</label>
                    <input
                      type="text"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      placeholder="What is this regarding?"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Message</label>
                    <textarea
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Write your message..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 min-h-[150px]"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 gradient-primary text-white py-3 rounded-xl font-semibold uppercase shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewMessage(false)}
                      className="px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
