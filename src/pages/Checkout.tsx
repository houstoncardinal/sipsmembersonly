import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useCart } from "@/context/CartContext";
import { formatBtc, usdToBtc, formatSats, usdToSats } from "@/data/products";
import { Bitcoin, Copy, Check, Clock, Zap, ShieldCheck } from "lucide-react";

type PaymentStatus = "pending_payment" | "payment_detected" | "confirming" | "confirmed" | "completed" | "expired";

const MOCK_BTC_ADDRESS = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";
const PAYMENT_TIMEOUT = 30 * 60; // 30 min in seconds
const REQUIRED_CONFIRMATIONS = 2;

export default function Checkout() {
  const { total, items, clearCart } = useCart();
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>("pending_payment");
  const [confirmations, setConfirmations] = useState(0);
  const [timeLeft, setTimeLeft] = useState(PAYMENT_TIMEOUT);
  const [copied, setCopied] = useState(false);
  const [mockMode, setMockMode] = useState(true);

  const btcAmount = usdToBtc(total);
  const satsAmount = usdToSats(total);

  // Countdown timer
  useEffect(() => {
    if (status !== "pending_payment") return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setStatus("expired");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [status]);

  // Mock payment simulation
  const simulatePayment = useCallback(() => {
    if (!mockMode) return;
    setStatus("payment_detected");
    setTimeout(() => {
      setStatus("confirming");
      setConfirmations(1);
    }, 2000);
    setTimeout(() => {
      setConfirmations(2);
      setStatus("confirmed");
    }, 4000);
    setTimeout(() => {
      setStatus("completed");
    }, 5500);
  }, [mockMode]);

  const copyAddress = () => {
    navigator.clipboard.writeText(MOCK_BTC_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (items.length === 0 && status !== "completed") {
    navigate("/cart");
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {/* Pending Payment */}
          {(status === "pending_payment" || status === "expired") && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-strong rounded-2xl p-8 glow-border text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-full gradient-primary flex items-center justify-center mb-6 animate-pulse-glow">
                <Bitcoin className="w-7 h-7 text-primary-foreground" />
              </div>

              <h1 className="font-serif text-2xl text-foreground mb-1">Pay with Bitcoin</h1>
              <p className="text-xs text-muted-foreground font-sans mb-8">
                Send the exact amount to the address below
              </p>

              {/* QR Placeholder */}
              <div className="w-48 h-48 mx-auto mb-6 rounded-xl glass flex items-center justify-center animate-pulse-glow">
                <div className="grid grid-cols-8 gap-0.5 w-32 h-32">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-full aspect-square rounded-[1px] ${
                        Math.random() > 0.4 ? "bg-foreground" : "bg-transparent"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div className="glass rounded-xl p-4 mb-4">
                <p className="text-xs text-muted-foreground font-sans mb-1">Amount</p>
                <p className="font-serif text-2xl text-foreground">{formatBtc(btcAmount)} BTC</p>
                <p className="text-xs text-primary font-sans font-medium mt-1">
                  {formatSats(satsAmount)} sats · ${total.toLocaleString()} USD
                </p>
              </div>

              {/* Address */}
              <div className="glass rounded-xl p-4 mb-6">
                <p className="text-xs text-muted-foreground font-sans mb-2">Wallet Address</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs text-foreground/80 font-mono break-all">
                    {MOCK_BTC_ADDRESS}
                  </code>
                  <button
                    onClick={copyAddress}
                    className="flex-shrink-0 w-8 h-8 rounded-md glass flex items-center justify-center text-foreground/70 hover:text-primary transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Timer */}
              {status === "expired" ? (
                <div className="text-destructive text-sm font-sans font-medium">
                  Payment expired. Please try again.
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-sans mb-6">
                  <Clock className="w-3.5 h-3.5" />
                  Expires in {formatTime(timeLeft)}
                </div>
              )}

              {/* Mock button */}
              {mockMode && status === "pending_payment" && (
                <button onClick={simulatePayment} className="btn-ghost-luxury w-full mt-4">
                  <Zap className="w-3.5 h-3.5 inline mr-2" />
                  Simulate Payment (Dev Mode)
                </button>
              )}

              <label className="flex items-center justify-center gap-2 mt-4 text-[10px] text-muted-foreground/40 font-sans cursor-pointer">
                <input
                  type="checkbox"
                  checked={mockMode}
                  onChange={(e) => setMockMode(e.target.checked)}
                  className="rounded border-border/50"
                />
                Mock BTC Testing Mode
              </label>
            </motion.div>
          )}

          {/* Payment Detected / Confirming */}
          {(status === "payment_detected" || status === "confirming" || status === "confirmed") && (
            <motion.div
              key="confirming"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-strong rounded-2xl p-8 glow-border text-center"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="w-14 h-14 mx-auto rounded-full gradient-primary flex items-center justify-center mb-6 animate-pulse-glow"
              >
                <Zap className="w-7 h-7 text-primary-foreground" />
              </motion.div>

              <h2 className="font-serif text-2xl text-foreground mb-2">
                {status === "payment_detected" ? "Payment Detected" : "Confirming on Chain"}
              </h2>
              <p className="text-xs text-muted-foreground font-sans mb-8">
                Waiting for blockchain confirmations…
              </p>

              {/* Confirmation Progress */}
              <div className="glass rounded-xl p-5 mb-6">
                <div className="flex justify-between text-xs font-sans text-muted-foreground mb-3">
                  <span>Confirmations</span>
                  <span className="text-primary font-medium">
                    {confirmations} / {REQUIRED_CONFIRMATIONS}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(confirmations / REQUIRED_CONFIRMATIONS) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full gradient-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-primary font-sans">
                <div className="w-2 h-2 rounded-full gradient-primary animate-pulse" />
                Monitoring blockchain…
              </div>
            </motion.div>
          )}

          {/* Completed */}
          {status === "completed" && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-strong rounded-2xl p-10 glow-border text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 10, stiffness: 150 }}
                className="w-20 h-20 mx-auto rounded-full gradient-primary flex items-center justify-center mb-6 animate-pulse-glow"
              >
                <ShieldCheck className="w-10 h-10 text-primary-foreground" />
              </motion.div>

              <h2 className="font-serif text-3xl text-foreground mb-3 glow-text">
                Payment Verified
              </h2>
              <p className="text-sm text-muted-foreground font-sans mb-2">
                Welcome to the Inner Circle.
              </p>
              <p className="text-xs text-primary font-sans font-medium mb-8">
                {formatBtc(btcAmount)} BTC confirmed · {REQUIRED_CONFIRMATIONS} confirmations
              </p>

              <button
                onClick={() => {
                  clearCart();
                  navigate("/orders");
                }}
                className="btn-luxury text-primary-foreground"
              >
                View Orders
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
