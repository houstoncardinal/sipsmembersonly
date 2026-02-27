import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import SyrupDrip from "@/components/ui/SyrupDrip";
import {
  Crown,
  Sparkles,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Check,
} from "lucide-react";

type Tab = "member" | "admin";

export default function Auth() {
  const { login, attempts, isLocked, devLogin } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>("member");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [granted, setGranted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !code.trim()) {
      setError("Please fill in both fields");
      return;
    }
    if (isLocked) {
      setError("Too many failed attempts. Try again in 15 minutes.");
      return;
    }

    setLoading(true);
    setError("");
    const ok = await login(email, code);
    setLoading(false);

    if (ok) {
      setGranted(true);
      const dest = tab === "admin" ? "/admin" : "/dashboard";
      setTimeout(() => navigate(dest), 900);
    } else {
      const remaining = 5 - (attempts + 1);
      if (remaining <= 0) {
        setError("Account locked for 15 minutes due to too many failed attempts.");
      } else {
        setError(
          tab === "admin"
            ? `Invalid credentials. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`
            : `Wrong email or access code. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`
        );
      }
    }
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    setError("");
    setCode("");
  };

  const slideVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #040008 0%, #0c0018 30%, #08000e 65%, #04000a 100%)",
      }}
    >
      {/* Syrup drip overlay */}
      <SyrupDrip />

      {/* Deep background glows */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute pointer-events-none"
        style={{
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 700,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(140,0,220,0.22) 0%, rgba(180,0,180,0.1) 40%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 11, repeat: Infinity, delay: 3 }}
        className="absolute pointer-events-none"
        style={{
          bottom: "10%",
          right: "10%",
          width: 400,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(220,0,160,0.18) 0%, transparent 65%)",
          filter: "blur(50px)",
        }}
      />

      {/* Floating syrup drop particles */}
      {[
        { x: "8%", delay: 0.0, dur: 18, size: 6, opacity: 0.5 },
        { x: "18%", delay: 2.3, dur: 22, size: 4, opacity: 0.4 },
        { x: "28%", delay: 1.1, dur: 16, size: 8, opacity: 0.45 },
        { x: "42%", delay: 3.5, dur: 20, size: 5, opacity: 0.35 },
        { x: "58%", delay: 0.7, dur: 19, size: 7, opacity: 0.5 },
        { x: "70%", delay: 2.8, dur: 17, size: 4, opacity: 0.4 },
        { x: "83%", delay: 1.4, dur: 21, size: 6, opacity: 0.45 },
        { x: "92%", delay: 4.0, dur: 15, size: 5, opacity: 0.35 },
      ].map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: "110vh" }}
          animate={{ opacity: [0, p.opacity, p.opacity, 0], y: "-10vh" }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "linear" }}
          className="absolute pointer-events-none"
          style={{
            left: p.x,
            width: p.size,
            height: p.size * 1.4,
            borderRadius: "50% 50% 60% 60% / 40% 40% 60% 60%",
            background:
              i % 2 === 0
                ? "radial-gradient(ellipse at 35% 30%, rgba(230,150,255,0.9) 0%, rgba(160,32,240,0.85) 100%)"
                : "radial-gradient(ellipse at 35% 30%, rgba(255,120,220,0.9) 0%, rgba(220,0,170,0.85) 100%)",
            boxShadow: "0 0 8px 2px rgba(200,50,255,0.4)",
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 40px rgba(160,32,240,0.4), 0 0 80px rgba(160,32,240,0.15)",
                "0 0 60px rgba(160,32,240,0.65), 0 0 120px rgba(220,0,160,0.25)",
                "0 0 40px rgba(160,32,240,0.4), 0 0 80px rgba(160,32,240,0.15)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4"
            style={{
              background: "linear-gradient(135deg, hsl(280 88% 55%), hsl(308 78% 58%))",
              border: "1px solid rgba(220,100,255,0.3)",
            }}
          >
            <Crown className="w-10 h-10 text-white drop-shadow-sm" />
          </motion.div>

          <h1
            className="font-serif text-4xl mb-3"
            style={{
              background: "linear-gradient(135deg, #e0aaff, #c060ff, #ff40cc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 16px rgba(180,32,240,0.5))",
            }}
          >
            Sips Gettin' Real
          </h1>

          <div className="flex items-center justify-center gap-2">
            <Sparkles
              className="w-4 h-4"
              style={{
                color: "hsl(308 78% 65%)",
                filter: "drop-shadow(0 0 5px rgba(255,50,200,0.5))",
              }}
            />
            <span
              className="text-xs font-sans font-bold tracking-[0.3em] uppercase"
              style={{ color: "rgba(200,160,255,0.8)" }}
            >
              Members Only
            </span>
            <Sparkles
              className="w-4 h-4"
              style={{
                color: "hsl(280 88% 70%)",
                filter: "drop-shadow(0 0 5px rgba(180,32,240,0.5))",
              }}
            />
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="rounded-3xl relative overflow-hidden"
          style={{
            background: "rgba(20,5,35,0.85)",
            backdropFilter: "blur(40px) saturate(180%)",
            border: "1px solid rgba(160,60,255,0.2)",
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(140,0,220,0.12), inset 0 1px 0 rgba(220,120,255,0.12), inset 0 -1px 0 rgba(255,40,200,0.06)",
          }}
        >
          {/* Top accent line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(200,80,255,0.7), rgba(255,40,200,0.6), transparent)",
              boxShadow: "0 0 16px 2px rgba(180,60,255,0.4)",
            }}
          />
          {/* Decorative glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: 200,
              height: 100,
              background:
                "radial-gradient(ellipse, rgba(160,32,240,0.2) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />

          {/* Tab Switcher */}
          <div className="relative z-10 p-2 pt-6 pb-0 px-6">
            <div
              className="flex rounded-2xl p-1"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["member", "admin"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => switchTab(t)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-sans font-bold tracking-wider uppercase transition-all duration-300"
                  style={
                    tab === t
                      ? {
                          background: "linear-gradient(135deg, rgba(160,32,240,0.5), rgba(220,0,160,0.35))",
                          color: "#fff",
                          boxShadow: "0 2px 12px rgba(160,0,240,0.3)",
                          border: "1px solid rgba(200,80,255,0.3)",
                        }
                      : {
                          color: "rgba(200,160,255,0.5)",
                          border: "1px solid transparent",
                        }
                  }
                >
                  {t === "member" ? (
                    <KeyRound className="w-3.5 h-3.5" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5" />
                  )}
                  {t === "member" ? "Member Access" : "Admin Access"}
                </button>
              ))}
            </div>
          </div>

          {/* Form Area */}
          <div className="p-6 relative z-10">
            <AnimatePresence mode="wait">
              {!granted ? (
                <motion.form
                  key={tab}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {/* Step title */}
                  <div className="text-center mb-5">
                    <h2 className="font-serif text-2xl text-white mb-1.5">
                      {tab === "member" ? "Enter The Circle" : "Admin Access"}
                    </h2>
                    <p className="text-xs font-sans" style={{ color: "rgba(180,140,255,0.65)" }}>
                      {tab === "member"
                        ? "Your email + this week's private access code"
                        : "Restricted — admin credentials required"}
                    </p>
                  </div>

                  {tab === "admin" && (
                    <div
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans"
                      style={{
                        background: "rgba(255,180,0,0.07)",
                        border: "1px solid rgba(255,180,0,0.2)",
                        color: "rgba(255,210,100,0.8)",
                      }}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                      Use the admin master key — contact the vault owner if you need access.
                    </div>
                  )}

                  <input
                    type="email"
                    placeholder={tab === "member" ? "your@email.com" : "admin@email.com"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl font-sans text-sm outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "#fff",
                    }}
                    onFocus={(e) => {
                      e.target.style.border = "1px solid rgba(180,80,255,0.5)";
                      e.target.style.boxShadow = "0 0 0 3px rgba(160,32,240,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.border = "1px solid rgba(255,255,255,0.12)";
                      e.target.style.boxShadow = "none";
                    }}
                    autoFocus
                    autoComplete="email"
                  />

                  <input
                    type="text"
                    placeholder={tab === "member" ? "XXXX-XXXX" : "Admin Master Key"}
                    value={code}
                    onChange={(e) =>
                      setCode(tab === "member" ? e.target.value.toUpperCase() : e.target.value)
                    }
                    className="w-full px-5 py-4 rounded-2xl font-mono text-base outline-none transition-all text-center tracking-[0.2em]"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: tab === "member" ? "#d4a0ff" : "#ffcc66",
                    }}
                    onFocus={(e) => {
                      e.target.style.border = `1px solid ${tab === "member" ? "rgba(180,80,255,0.5)" : "rgba(255,180,0,0.4)"}`;
                      e.target.style.boxShadow = `0 0 0 3px ${tab === "member" ? "rgba(160,32,240,0.12)" : "rgba(255,180,0,0.08)"}`;
                    }}
                    onBlur={(e) => {
                      e.target.style.border = "1px solid rgba(255,255,255,0.12)";
                      e.target.style.boxShadow = "none";
                    }}
                    autoComplete="off"
                  />

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2 text-xs font-sans px-4 py-3 rounded-xl"
                      style={{
                        background: "rgba(255,60,60,0.1)",
                        border: "1px solid rgba(255,60,60,0.25)",
                        color: "rgba(255,130,130,0.9)",
                      }}
                    >
                      <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  {isLocked && (
                    <div
                      className="flex items-center gap-2 text-xs font-sans px-4 py-3 rounded-xl"
                      style={{
                        background: "rgba(255,60,60,0.08)",
                        border: "1px solid rgba(255,60,60,0.2)",
                        color: "rgba(255,120,120,0.8)",
                      }}
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      Account locked — try again in 15 minutes
                    </div>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading || isLocked}
                    className="w-full py-4 rounded-2xl font-sans font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-50 relative overflow-hidden"
                    style={
                      tab === "member"
                        ? {
                            background: "linear-gradient(135deg, hsl(280 88% 55%), hsl(308 78% 58%))",
                            color: "#fff",
                            boxShadow: "0 8px 30px rgba(160,0,240,0.4)",
                          }
                        : {
                            background: "linear-gradient(135deg, #7a5c00, #c49000)",
                            color: "#fff8e0",
                            boxShadow: "0 8px 30px rgba(200,150,0,0.3)",
                          }
                    }
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : tab === "member" ? (
                      "Access The Vault"
                    ) : (
                      "Enter Admin Panel"
                    )}
                  </motion.button>

                  {tab === "member" && (
                    <p
                      className="text-center text-[10px] font-sans"
                      style={{ color: "rgba(180,140,255,0.4)" }}
                    >
                      Access codes rotate every week · Contact an admin if yours has expired
                    </p>
                  )}
                </motion.form>
              ) : (
                /* Access Granted State */
                <motion.div
                  key="granted"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  className="text-center py-10"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10, stiffness: 200, delay: 0.1 }}
                    className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-5"
                    style={{
                      background: "linear-gradient(135deg, hsl(280 88% 55%), hsl(308 78% 58%))",
                      boxShadow: "0 0 60px rgba(160,0,240,0.5)",
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    >
                      <Check className="w-12 h-12 text-white" />
                    </motion.div>
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="font-serif text-3xl text-white mb-2"
                  >
                    Access Granted
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="text-sm font-sans"
                    style={{ color: "rgba(200,160,255,0.6)" }}
                  >
                    {tab === "admin" ? "Entering the Admin Vault..." : "Entering the Inner Circle..."}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* ── DEV BYPASS — floating bottom-right ───────────────────────────── */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            devLogin();
            navigate("/admin");
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-sans tracking-wider uppercase"
          style={{
            background: "rgba(20,5,35,0.9)",
            border: "1px solid rgba(160,60,255,0.35)",
            color: "rgba(200,140,255,0.9)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5), 0 0 20px rgba(140,0,220,0.15)",
          }}
        >
          <span style={{ fontSize: 14 }}>⚡</span>
          Dev — Admin Login
        </motion.button>
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            devLogin("member@sipsgettinreal.test");
            navigate("/dashboard");
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-sans tracking-wider uppercase"
          style={{
            background: "rgba(20,5,35,0.9)",
            border: "1px solid rgba(255,60,200,0.25)",
            color: "rgba(255,160,220,0.8)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5), 0 0 20px rgba(220,0,160,0.12)",
          }}
        >
          <span style={{ fontSize: 14 }}>⚡</span>
          Dev — Member Login
        </motion.button>
      </div>
    </div>
  );
}
