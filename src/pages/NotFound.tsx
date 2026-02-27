import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-purple-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-purple-100 flex items-center justify-center"
        >
          <AlertCircle className="w-12 h-12 text-purple-600" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-serif text-6xl font-bold text-slate-900 mb-4"
        >
          404
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-slate-600 mb-8"
        >
          Oops! The page you're looking for doesn't exist or has been moved.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold uppercase shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm"
        >
          <h3 className="font-serif text-lg font-bold text-slate-900 mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/dashboard" className="p-3 rounded-xl bg-purple-50 text-purple-700 font-semibold hover:bg-purple-100 transition-colors">
              Shop
            </Link>
            <Link to="/cart" className="p-3 rounded-xl bg-purple-50 text-purple-700 font-semibold hover:bg-purple-100 transition-colors">
              Cart
            </Link>
            <Link to="/orders" className="p-3 rounded-xl bg-purple-50 text-purple-700 font-semibold hover:bg-purple-100 transition-colors">
              Orders
            </Link>
            <Link to="/account" className="p-3 rounded-xl bg-purple-50 text-purple-700 font-semibold hover:bg-purple-100 transition-colors">
              Account
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
