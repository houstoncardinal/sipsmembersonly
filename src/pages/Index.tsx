import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export default function Index() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden gradient-dark">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-primary/3 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 text-center px-6"
      >
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-2 glow-text">
            Sips Gettin' Real
          </h1>
          <div className="w-24 h-0.5 mx-auto gradient-primary rounded-full mb-8" />
        </motion.div>

        {/* Members Only Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex items-center justify-center gap-2 mb-12"
        >
          <Lock className="w-3.5 h-3.5 text-primary/70" />
          <span className="text-xs font-sans font-medium tracking-[0.4em] uppercase text-muted-foreground">
            Members Only
          </span>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Link to="/auth" className="btn-luxury inline-block text-primary-foreground">
            Sign In
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-6 text-xs text-muted-foreground/50 font-sans"
        >
          Exclusive access required
        </motion.p>
      </motion.div>

      {/* Bottom line accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
}
