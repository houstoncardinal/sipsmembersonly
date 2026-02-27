import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useMessages } from "@/context/MessageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  ShoppingCart,
  ClipboardList,
  Shield,
  Settings,
  LogOut,
  Menu,
  X,
  Crown,
  Package,
  Users,
  BarChart3,
  Key,
  Search,
  Home,
  Bell,
  MessageSquare,
  User,
  HelpCircle,
} from "lucide-react";
import { useState, useEffect } from "react";

/* ─── Nav items ─────────────────────────────────────────── */
const userNavItems = [
  { path: "/dashboard", label: "Shop",      icon: ShoppingBag   },
  { path: "/cart",      label: "Cart",      icon: ShoppingCart, highlight: true },
  { path: "/orders",    label: "My Orders", icon: ClipboardList },
  { path: "/account",   label: "Account",   icon: User          },
  { path: "/messages",  label: "Messages",  icon: MessageSquare },
];

const adminNavItems = [
  { path: "/admin",           label: "Dashboard", icon: BarChart3,   section: "admin" },
  { path: "/admin/products",  label: "Products",  icon: Package,     section: "admin" },
  { path: "/admin/orders",    label: "Orders",    icon: ClipboardList, section: "admin" },
  { path: "/admin/members",   label: "Members",   icon: Users,       section: "admin" },
  { path: "/admin/invites",   label: "Invites",   icon: Key,         section: "admin" },
  { path: "/admin/security",  label: "Security",  icon: Settings,    section: "admin" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated, sessionExpiresAt, extendSession } = useAuth();
  const { itemCount } = useCart();
  const { getUnreadCount } = useMessages();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleActivity = () => {
      if (sessionExpiresAt && sessionExpiresAt - Date.now() < 15 * 60 * 1000) {
        extendSession();
      }
    };
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
    };
  }, [sessionExpiresAt, extendSession]);

  if (!isAuthenticated) return null;

  const handleLogout = () => { logout(); navigate("/"); };
  const isAdmin = user?.role === "admin";
  const navItems = isAdmin ? adminNavItems : userNavItems;
  const unreadCount = !isAdmin ? getUnreadCount(user?.email || "") : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/dashboard?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#f5f6fa" }}
    >
      {/* ═══════════════════════════════════════════════
          DESKTOP SIDEBAR — clean white, professional
          ═══════════════════════════════════════════════ */}
      <aside
        className="hidden lg:flex flex-col w-72 relative"
        style={{
          background: "#ffffff",
          borderRight: "1px solid #eaecf0",
          boxShadow: "4px 0 24px rgba(0,0,0,0.04)",
          zIndex: 10,
        }}
      >
        {/* Purple accent bar at very top */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, height: "3px",
            background: "linear-gradient(90deg, #7c00d4 0%, #a020f0 50%, #d400aa 100%)",
          }}
        />

        {/* Logo */}
        <Link
          to={isAdmin ? "/admin" : "/dashboard"}
          className="p-6 group transition-all duration-200"
          style={{ borderBottom: "1px solid #f0f0f4", marginTop: "3px" }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 6, scale: 1.06 }}
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #7c00d4, #d400aa)",
                boxShadow: "0 4px 14px rgba(124,0,212,0.35)",
              }}
            >
              <Crown className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="font-serif text-base leading-tight text-slate-900 font-bold">
                Sips Gettin'
              </h1>
              <p
                className="text-[10px] tracking-[0.3em] uppercase font-sans font-bold"
                style={{ color: "#9920d0" }}
              >
                Real
              </p>
            </div>
          </div>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="px-4 py-3">
          <div
            className="flex items-center rounded-lg overflow-hidden transition-all"
            style={{
              background: "#f7f8fa",
              border: "1px solid #e8eaf0",
            }}
          >
            <Search className="w-4 h-4 ml-3 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder={isAdmin ? "Search..." : "Search products..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-transparent text-slate-800 placeholder:text-slate-400 outline-none"
            />
          </div>
        </form>

        {/* Nav label */}
        <p className="px-5 pt-2 pb-1 text-[10px] font-bold tracking-widest uppercase text-slate-400">
          {isAdmin ? "Admin" : "Navigation"}
        </p>

        {/* Navigation */}
        <nav className="flex-1 px-3 pb-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            const showBadge = item.label === "Cart" && itemCount > 0;
            const messageBadge = item.label === "Messages" && unreadCount > 0;

            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans font-medium transition-all duration-200 group"
                style={
                  active
                    ? {
                        background: "rgba(124,0,212,0.07)",
                        color: "#7c00d4",
                        fontWeight: 600,
                      }
                    : {
                        color: "#64748b",
                      }
                }
              >
                {active && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
                    style={{
                      width: "3px",
                      height: "18px",
                      background: "linear-gradient(180deg, #7c00d4, #d400aa)",
                    }}
                  />
                )}
                <item.icon
                  className="w-4.5 h-4.5 flex-shrink-0 transition-colors"
                  style={{
                    width: "18px", height: "18px",
                    color: active ? "#9920d0" : "#94a3b8",
                  }}
                />
                <span className="flex-1">{item.label}</span>

                {showBadge && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-[10px] text-white px-1.5 py-0.5 rounded-full font-bold"
                    style={{ background: "linear-gradient(135deg, #7c00d4, #d400aa)" }}
                  >
                    {itemCount}
                  </motion.span>
                )}

                {messageBadge && unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-bold"
                  >
                    {unreadCount}
                  </motion.span>
                )}

                {/* Hover state */}
                {!active && (
                  <div
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "#f8f9fc" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-3" style={{ borderTop: "1px solid #f0f0f4" }}>
          <Link
            to={isAdmin ? "/admin" : "/dashboard"}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all group hover:bg-slate-50"
          >
            <motion.div
              whileHover={{ scale: 1.08 }}
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #7c00d4, #d400aa)",
                boxShadow: "0 2px 10px rgba(124,0,212,0.35)",
              }}
            >
              {user?.name?.[0]}
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-slate-800">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
            <Home className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all group"
          >
            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════
          DESKTOP TOP BAR — clean white
          ═══════════════════════════════════════════════ */}
      <div
        className="hidden lg:flex fixed top-0 right-0 left-72 z-40"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid #eaecf0",
          boxShadow: "0 1px 12px rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex-1 flex items-center justify-between px-8 py-3.5">
          {/* Welcome */}
          <div>
            <p className="text-xs text-slate-400 font-sans">Welcome back</p>
            <p className="text-sm font-bold text-slate-800">{user?.name}</p>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <form onSubmit={handleSearch}>
              <div
                className="flex items-center rounded-lg px-4 py-2 w-72"
                style={{
                  background: "#f7f8fa",
                  border: "1px solid #e8eaf0",
                }}
              >
                <Search className="w-4 h-4 mr-3 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder={isAdmin ? "Search..." : "Search products..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
                />
              </div>
            </form>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #7c00d4, #d400aa)",
                boxShadow: "0 4px 14px rgba(124,0,212,0.35)",
              }}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Cart</span>
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 text-[10px] text-white w-5 h-5 rounded-full flex items-center justify-center font-bold bg-rose-500"
                  style={{ boxShadow: "0 0 8px rgba(244,63,94,0.6)" }}
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>

            {!isAdmin && (
              <Link
                to="/messages"
                className="relative p-2 rounded-lg transition-all hover:bg-slate-100"
                style={{ color: "#64748b" }}
              >
                <MessageSquare className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-[10px] bg-rose-500 text-white w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          MOBILE HEADER
          ═══════════════════════════════════════════════ */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-50"
        style={{
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid #eaecf0",
          boxShadow: "0 1px 10px rgba(0,0,0,0.05)",
        }}
      >
        {/* Purple top bar */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, height: "2px",
            background: "linear-gradient(90deg, #7c00d4, #a020f0, #d400aa)",
          }}
        />
        <div className="px-4 py-3 flex items-center justify-between mt-0.5">
          <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c00d4, #d400aa)" }}
            >
              <Crown className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-serif text-sm font-bold text-slate-900 leading-none block">Sips Gettin'</span>
              <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-purple-700 leading-none block">Real</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/cart"
              className="relative p-2 rounded-lg text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #7c00d4, #d400aa)",
                boxShadow: "0 3px 10px rgba(124,0,212,0.35)",
              }}
            >
              <ShoppingCart className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 text-[10px] bg-rose-500 text-white w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold border-2 border-white"
                  style={{ width: 18, height: 18 }}
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>

            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg transition-colors"
              style={{ background: "#f5f6fa", border: "1px solid #eaecf0" }}
            >
              <Menu className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          MOBILE SIDEBAR
          ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-50"
              style={{ background: "rgba(15,10,30,0.45)", backdropFilter: "blur(4px)" }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 z-50 flex flex-col"
              style={{
                background: "#ffffff",
                borderRight: "1px solid #eaecf0",
                boxShadow: "8px 0 40px rgba(0,0,0,0.1)",
              }}
            >
              {/* Purple top accent */}
              <div
                style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0, height: "3px",
                  background: "linear-gradient(90deg, #7c00d4, #a020f0, #d400aa)",
                }}
              />
              <div
                className="p-4 flex justify-end"
                style={{ borderBottom: "1px solid #f0f0f4", marginTop: "3px" }}
              >
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Mobile logo */}
              <Link
                to={isAdmin ? "/admin" : "/dashboard"}
                className="p-4 flex items-center gap-3"
                style={{ borderBottom: "1px solid #f0f0f4" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #7c00d4, #d400aa)", boxShadow: "0 3px 12px rgba(124,0,212,0.35)" }}
                >
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-serif text-base font-bold text-slate-900 leading-none block">Sips Gettin'</span>
                  <span className="text-[10px] tracking-[0.25em] uppercase font-bold leading-none mt-0.5 block" style={{ color: "#9920d0" }}>Real</span>
                </div>
              </Link>

              <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
                {navItems.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans font-medium transition-all"
                      style={
                        active
                          ? { background: "rgba(124,0,212,0.07)", color: "#7c00d4", fontWeight: 600 }
                          : { color: "#64748b" }
                      }
                    >
                      <item.icon className="w-4.5 h-4.5 flex-shrink-0" style={{ width: 18, height: 18, color: active ? "#9920d0" : "#94a3b8" }} />
                      {item.label}
                      {item.label === "Cart" && itemCount > 0 && (
                        <span className="ml-auto text-[10px] text-white px-1.5 py-0.5 rounded-full font-bold" style={{ background: "linear-gradient(135deg, #7c00d4, #d400aa)" }}>
                          {itemCount}
                        </span>
                      )}
                      {item.label === "Messages" && unreadCount > 0 && (
                        <span className="ml-auto text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-3" style={{ borderTop: "1px solid #f0f0f4" }}>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-rose-500 hover:bg-rose-50 rounded-lg w-full transition-all font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════
          MAIN CONTENT — clean light
          ═══════════════════════════════════════════════ */}
      <main
        className="flex-1 overflow-y-auto lg:pt-0 pt-16"
        style={{ background: "#f5f6fa", position: "relative", zIndex: 5 }}
      >
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 lg:p-8 lg:pt-20"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
