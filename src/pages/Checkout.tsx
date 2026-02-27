import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useCart } from "@/context/CartContext";
import { formatBtc, usdToBtc, formatSats, usdToSats } from "@/data/products";
import {
  Bitcoin,
  Copy,
  Check,
  Clock,
  Zap,
  ShieldCheck,
  Loader2,
  Sparkles,
  Timer,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type PaymentStatus = "pending_payment" | "payment_detected" | "confirming" | "confirmed" | "completed" | "expired";

const MOCK_BTC_ADDRESS = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";
const PAYMENT_TIMEOUT = 30 * 60; // 30 min in seconds
const REQUIRED_CONFIRMATIONS = 2;

// Animated QR Code Component
function AnimatedQRCode({ value }: { value: string }) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="relative w-56 h-56 mx-auto mb-6">
      {/* Glow Background */}
      <div className="absolute inset-0 rounded-2xl gradient-primary opacity-20 blur-xl animate-pulse" />
      
      {/* QR Container */}
      <div className="relative w-full h-full rounded-2xl glass-strong p-4 glow-border overflow-hidden">
        {/* Animated Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            className="absolute w-1 h-1 rounded-full bg-primary"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
          />
        ))}

        {/* QR Pattern */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <div className="grid grid-cols-12 gap-0.5 w-40 h-40">
            {Array.from({ length: 144 }).map((_, i) => {
              const isCorner =
                (i < 15 && i % 12 < 5) || // Top-left
                (i < 15 && i % 12 >= 7) || // Top-right area
                (i >= 84 && i % 12 < 5) || // Bottom-left
                (i >= 84 && i % 12 >= 7); // Bottom-right area
              const isActive = Math.random() > 0.4 || isCorner;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ delay: i * 0.01 }}
                  className={`w-full aspect-square rounded-[1px] ${
                    isActive ? "bg-foreground" : "bg-transparent"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Bitcoin Logo Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center glow-border">
            <Bitcoin className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>

        {/* Scanning Line */}
        <motion.div
          initial={{ top: "0%" }}
          animate={{ top: "100%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
        />
      </div>
    </div>
  );
}

export default function Checkout() {
  const { total, items, clearCart } = useCart();
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>("pending_payment");
  const [confirmations, setConfirmations] = useState(0);
  const [timeLeft, setTimeLeft] = useState(PAYMENT_TIMEOUT);
  const [copied, setCopied] = useState(false);
  const [mockMode, setMockMode] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);

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
    if (!mockMode || isSimulating) return;
    setIsSimulating(true);
    
    // Step 1: Payment detected
    setTimeout(() => {
      setStatus("payment_detected");
    }, 1500);
    
    // Step 2: Start confirming
    setTimeout(() => {
      setStatus("confirming");
      setConfirmations(1);
    }, 3000);
    
    // Step 3: Confirmed
    setTimeout(() => {
      setConfirmations(2);
      setStatus("confirmed");
    }, 5000);
    
    // Step 4: Completed
    setTimeout(() => {
      setStatus("completed");
      setIsSimulating(false);
    }, 6500);
  }, [mockMode, isSimulating]);

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
              {/* Header */}
              <div className="mb-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4"
                >
                  <Bitcoin className="w-4 h-4 text-primary" />
                  <span className="text-xs font-sans font-bold tracking-wider uppercase text-primary">
                    Secure Crypto Payment
                  </span>
                </motion.div>
                <h1 className="font-serif text-2xl text-foreground mb-2">Pay with Bitcoin</h1>
                <p className="text-xs text-muted-foreground font-sans">
                  Send the exact amount to the address below
                </p>
              </div>

              {/* Animated QR Code */}
              <AnimatedQRCode value={MOCK_BTC_ADDRESS} />

              {/* Amount Display */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-xl p-5 mb-4"
              >
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-sans mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  Exact Amount Due
                </div>
                <p className="font-serif text-3xl text-foreground mb-1">{formatBtc(btcAmount)} BTC</p>
                <div className="flex items-center justify-center gap-3 text-sm">
                  <p className="text-primary font-sans font-medium">{formatSats(satsAmount)} sats</p>
                  <span className="text-muted-foreground">·</span>
                  <p className="text-foreground">${total.toLocaleString()} USD</p>
                </div>
              </motion.div>

              {/* Address Copy */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-xl p-4 mb-6"
              >
                <p className="text-xs text-muted-foreground font-sans mb-2 text-left">Wallet Address</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs text-foreground/80 font-mono break-all text-left">
                    {MOCK_BTC_ADDRESS}
                  </code>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={copyAddress}
                    className="flex-shrink-0 w-10 h-10 rounded-lg glass flex items-center justify-center text-foreground/70 hover:text-primary transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {/* Timer */}
              {status === "expired" ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-2 text-destructive text-sm font-sans font-medium mb-6"
                >
                  <AlertCircle className="w-4 h-4" />
                  Payment window expired. Please initiate a new order.
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-sans mb-6"
                >
                  <Timer className="w-4 h-4 text-primary" />
                  <span>Payment window expires in </span>
                  <span className="text-primary font-medium">{formatTime(timeLeft)}</span>
                </motion.div>
              )}

              {/* Features */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { icon: ShieldCheck, label: "Secure" },
                  { icon: Zap, label: "Fast" },
                  { icon: CheckCircle2, label: "Verified" },
                ].map((feature) => (
                  <div key={feature.label} className="glass rounded-lg p-3 flex flex-col items-center gap-1">
                    <feature.icon className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-sans font-medium text-muted-foreground">{feature.label}</span>
                  </div>
                ))}
              </div>

              {/* Mock Payment Button */}
              {mockMode && status === "pending_payment" && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={simulatePayment}
                  disabled={isSimulating}
                  className="btn-ghost-luxury w-full flex items-center justify-center gap-2"
                >
                  {isSimulating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Simulate Payment (Dev Mode)
                    </>
                  )}
                </motion.button>
              )}

              {/* Mock Mode Toggle */}
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

          {/* Payment Detected / Confirming / Confirmed */}
          {(status === "payment_detected" || status === "confirming" || status === "confirmed") && (
            <motion.div
              key="confirming"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-strong rounded-2xl p-8 glow-border text-center"
            >
              {/* Animated Status Icon */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="relative w-20 h-20 mx-auto mb-6"
              >
                <div className="absolute inset-0 rounded-full gradient-primary opacity-20 blur-xl animate-pulse" />
                <div className="relative w-full h-full rounded-full gradient-primary flex items-center justify-center glow-border">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-10 h-10 text-primary-foreground" />
                  </motion.div>
                </div>
              </motion.div>

              <h2 className="font-serif text-2xl text-foreground mb-2">
                {status === "payment_detected" && "Payment Detected"}
                {status === "confirming" && "Confirming on Chain"}
                {status === "confirmed" && "Payment Confirmed"}
              </h2>
              <p className="text-xs text-muted-foreground font-sans mb-8">
                {status === "payment_detected" && "Transaction found in mempool. Waiting for confirmations..."}
                {status === "confirming" && "Your payment is being verified on the blockchain..."}
                {status === "confirmed" && "Payment verified. Finalizing order..."}
              </p>

              {/* Confirmation Progress */}
              <div className="glass rounded-xl p-6 mb-6">
                <div className="flex justify-between text-xs font-sans text-muted-foreground mb-3">
                  <span>Blockchain Confirmations</span>
                  <span className="text-primary font-medium">
                    {confirmations} / {REQUIRED_CONFIRMATIONS}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(confirmations / REQUIRED_CONFIRMATIONS) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full rounded-full gradient-primary relative"
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                  </motion.div>
                </div>

                {/* Confirmation Steps */}
                <div className="flex justify-between mt-4">
                  {[0, 1, 2].map((step) => (
                    <motion.div
                      key={step}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{
                        scale: confirmations >= step ? 1 : 0.8,
                        opacity: confirmations >= step ? 1 : 0.3,
                      }}
                      className={`w-3 h-3 rounded-full ${
                        confirmations >= step ? "gradient-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Live Status */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2 text-xs text-primary font-sans"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 rounded-full gradient-primary"
                />
                {status === "confirmed" ? "Finalizing order..." : "Monitoring blockchain..."}
              </motion.div>
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
              {/* Success Animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 10, stiffness: 150, delay: 0.2 }}
                className="relative w-24 h-24 mx-auto mb-6"
              >
                <div className="absolute inset-0 rounded-full gradient-primary opacity-30 blur-2xl" />
                <div className="relative w-full h-full rounded-full gradient-primary flex items-center justify-center glow-border">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  >
                    <ShieldCheck className="w-12 h-12 text-primary-foreground" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Success Particles */}
              <div className="relative h-0 mb-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: (Math.random() - 0.5) * 200,
                      y: (Math.random() - 0.5) * 200,
                    }}
                    transition={{
                      duration: 1.5,
                      delay: 0.5 + Math.random() * 0.5,
                    }}
                    className="absolute left-1/2 top-0 w-2 h-2 rounded-full gradient-primary"
                  />
                ))}
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-serif text-3xl text-foreground mb-3 glow-text"
              >
                Payment Verified
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-muted-foreground font-sans mb-2"
              >
                Welcome to the Inner Circle.
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs text-primary font-sans font-medium mb-8"
              >
                {formatBtc(btcAmount)} BTC confirmed · {REQUIRED_CONFIRMATIONS} confirmations
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
