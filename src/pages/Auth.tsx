import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Lock, KeyRound, ShieldCheck, ArrowRight, AlertCircle, Loader2, Check } from "lucide-react";

const steps = [
  { label: "Sign In", icon: Lock },
  { label: "Access Phrase", icon: KeyRound },
  { label: "Verify", icon: ShieldCheck },
  { label: "Enter", icon: ArrowRight },
];

export default function Auth() {
  const { login, verifyPhrase, verify2FA, authStep, attempts, isLocked } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phrase, setPhrase] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError("");
    const ok = await login(email, password);
    setLoading(false);
    if (!ok) setError("Invalid credentials");
  };

  const handlePhrase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) {
      setError("Account locked. Try again in 15 minutes.");
      return;
    }
    setLoading(true);
    setError("");
    const ok = await verifyPhrase(phrase);
    setLoading(false);
    if (!ok) setError(`Invalid phrase. ${5 - attempts - 1} attempts remaining.`);
  };

  const handle2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const ok = await verify2FA(code || "000000");
    setLoading(false);
    if (ok) {
      setTimeout(() => navigate("/dashboard"), 800);
    } else {
      setError("Verification failed");
    }
  };

  const skip2FA = async () => {
    setLoading(true);
    const ok = await verify2FA("skip");
    setLoading(false);
    if (ok) setTimeout(() => navigate("/dashboard"), 800);
  };

  const currentStep = authStep;

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-dark px-4 relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand */}
        <h1 className="font-serif text-3xl text-center mb-8 text-foreground glow-text">
          Sips Gettin' Real
        </h1>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-10 px-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ${
                    i < currentStep
                      ? "gradient-primary text-primary-foreground"
                      : i === currentStep
                      ? "border-2 border-primary text-primary animate-pulse-glow"
                      : "border border-border/50 text-muted-foreground/40"
                  }`}
                >
                  {i < currentStep ? <Check className="w-4 h-4" /> : <step.icon className="w-3.5 h-3.5" />}
                </div>
                <span
                  className={`text-[10px] font-sans font-medium tracking-wider ${
                    i <= currentStep ? "text-foreground/80" : "text-muted-foreground/30"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-2 mt-[-18px] transition-all duration-500 ${
                  i < currentStep ? "stepper-line-active" : "bg-border/30"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl p-8 glow-border">
          <AnimatePresence mode="wait">
            {/* Step 0: Login */}
            {currentStep === 0 && (
              <motion.form
                key="login"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                onSubmit={handleLogin}
                className="space-y-5"
              >
                <div className="text-center mb-6">
                  <h2 className="font-serif text-xl text-foreground mb-1">Welcome Back</h2>
                  <p className="text-xs text-muted-foreground font-sans">Sign in to access the members store</p>
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-luxury"
                  autoFocus
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-luxury"
                />
                {error && (
                  <div className="flex items-center gap-2 text-xs text-destructive font-sans">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error}
                  </div>
                )}
                <button type="submit" disabled={loading} className="btn-luxury w-full text-primary-foreground flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                </button>
              </motion.form>
            )}

            {/* Step 1: Access Phrase */}
            {currentStep === 1 && (
              <motion.form
                key="phrase"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                onSubmit={handlePhrase}
                className="space-y-5"
              >
                <div className="text-center mb-6">
                  <h2 className="font-serif text-xl text-foreground mb-1">Access Phrase</h2>
                  <p className="text-xs text-muted-foreground font-sans">Enter your secret access phrase to continue</p>
                </div>
                <input
                  type="password"
                  placeholder="Enter access phrase…"
                  value={phrase}
                  onChange={(e) => setPhrase(e.target.value)}
                  className="input-luxury text-center tracking-widest"
                  autoFocus
                />
                {error && (
                  <div className="flex items-center gap-2 text-xs text-destructive font-sans">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error}
                  </div>
                )}
                <button type="submit" disabled={loading || isLocked} className="btn-luxury w-full text-primary-foreground flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                </button>
              </motion.form>
            )}

            {/* Step 2: 2FA */}
            {currentStep === 2 && (
              <motion.form
                key="2fa"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                onSubmit={handle2FA}
                className="space-y-5"
              >
                <div className="text-center mb-6">
                  <h2 className="font-serif text-xl text-foreground mb-1">Two-Factor Auth</h2>
                  <p className="text-xs text-muted-foreground font-sans">Enter your authenticator code</p>
                </div>
                <input
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="input-luxury text-center text-2xl tracking-[0.5em] font-sans"
                  maxLength={6}
                  autoFocus
                />
                {error && (
                  <div className="flex items-center gap-2 text-xs text-destructive font-sans">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error}
                  </div>
                )}
                <button type="submit" disabled={loading} className="btn-luxury w-full text-primary-foreground flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                </button>
                <button type="button" onClick={skip2FA} className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors font-sans">
                  Skip for now
                </button>
              </motion.form>
            )}

            {/* Step 4: Complete */}
            {currentStep >= 4 && (
              <motion.div
                key="complete"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10, stiffness: 200, delay: 0.2 }}
                  className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center mb-4 animate-pulse-glow"
                >
                  <Check className="w-8 h-8 text-primary-foreground" />
                </motion.div>
                <h2 className="font-serif text-2xl text-foreground mb-2 glow-text">Welcome In</h2>
                <p className="text-xs text-muted-foreground font-sans">Entering the Inner Circle…</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dev hint */}
        <p className="text-center text-[10px] text-muted-foreground/30 mt-6 font-sans">
          Dev: admin@sipsgettinreal.test / Password123! · Phrase: inner-circle
        </p>
      </motion.div>
    </div>
  );
}
