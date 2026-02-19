import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
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
} from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  { path: "/dashboard", label: "Store", icon: ShoppingBag },
  { path: "/cart", label: "Cart", icon: ShoppingCart },
  { path: "/orders", label: "Orders", icon: ClipboardList },
  { path: "/account", label: "Account", icon: Shield },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 glass-strong border-r border-border/30">
        <div className="p-6 border-b border-border/30">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Crown className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-lg leading-tight text-foreground">Sips Gettin'</h1>
              <p className="text-xs tracking-[0.3em] uppercase text-primary font-sans">Real</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-sans font-medium transition-all duration-300 ${
                  active
                    ? "bg-primary/15 text-primary glow-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {item.label === "Cart" && itemCount > 0 && (
                  <span className="ml-auto text-xs gradient-primary text-primary-foreground px-2 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>
            );
          })}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-sans font-medium transition-all duration-300 ${
                location.pathname === "/admin"
                  ? "bg-primary/15 text-primary glow-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Settings className="w-4 h-4" />
              Admin
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-border/30">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
              {user?.name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/30 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)} className="text-foreground">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="font-serif text-lg text-foreground">Sips Gettin' Real</h1>
        <Link to="/cart" className="relative text-foreground">
          <ShoppingCart className="w-5 h-5" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 text-[10px] gradient-primary text-primary-foreground w-4 h-4 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Link>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 z-50 glass-strong border-r border-border/30 flex flex-col"
            >
              <div className="p-4 flex justify-end">
                <button onClick={() => setSidebarOpen(false)} className="text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-sans font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-sans font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                  >
                    <Settings className="w-4 h-4" />
                    Admin
                  </Link>
                )}
              </nav>
              <div className="p-4 border-t border-border/30">
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-destructive">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto lg:pt-0 pt-16">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 lg:p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
