import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Clock, Lock, Eye } from "lucide-react";
import { Product, formatBtc, usdToBtc } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";

function CountdownTimer({ dropTime }: { dropTime: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = new Date(dropTime).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("LIVE NOW");
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [dropTime]);

  return (
    <div className="flex items-center gap-1.5 text-xs font-sans font-medium text-purple-500">
      <Clock className="w-3 h-3" />
      {timeLeft}
    </div>
  );
}

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const cartItem = items.find((i) => i.product.id === product.id);
  const atLimit = product.limitPerMember
    ? (cartItem?.quantity ?? 0) >= product.limitPerMember
    : false;

  const isDropPending = product.dropTime
    ? new Date(product.dropTime).getTime() > Date.now()
    : false;

  const handleAdd = () => {
    if (atLimit || isDropPending) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-card shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
        {/* Image Container */}
        <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden">
          {/* Image */}
          <motion.img
            src={product.image}
            alt={product.name}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className={`w-full h-full object-cover ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton" />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg text-[10px] font-sans font-bold tracking-widest uppercase gradient-primary text-white shadow-lg">
              {product.badge}
            </div>
          )}

          {/* Category */}
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg text-[10px] font-sans font-medium tracking-wider uppercase backdrop-blur-md bg-white/20 text-white border border-white/30">
            {product.categoryLabel}
          </div>

          {/* Quick View Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div className="flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-md bg-white/90 text-slate-900 text-sm font-semibold shadow-2xl">
              <Eye className="w-4 h-4" />
              Quick View
            </div>
          </motion.div>

          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs font-sans mb-1">Price</p>
                <p className="text-white font-serif text-2xl font-bold">
                  ${product.price.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-[10px] font-sans">Bitcoin</p>
                <p className="text-purple-300 text-xs font-mono font-medium">
                  {formatBtc(usdToBtc(product.price))} BTC
                </p>
              </div>
            </div>
          </div>
        </Link>

        {/* Content */}
        <div className="p-4">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-serif text-lg font-semibold text-slate-900 dark:text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          
          <p className="text-xs text-slate-500 dark:text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {product.dropTime && (
            <div className="mt-3">
              <CountdownTimer dropTime={product.dropTime} />
            </div>
          )}

          {/* Add to Cart */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-border/30">
            {product.stock <= 10 && (
              <p className="text-[10px] text-red-500 font-sans font-medium">
                Only {product.stock} left
              </p>
            )}
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              disabled={atLimit || isDropPending}
              className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-sans font-semibold tracking-wider uppercase transition-all duration-300 ${
                added
                  ? "gradient-primary text-white shadow-lg shadow-purple-500/30"
                  : atLimit
                  ? "bg-slate-100 dark:bg-muted text-slate-400 cursor-not-allowed"
                  : isDropPending
                  ? "bg-slate-100 dark:bg-muted text-slate-400 cursor-not-allowed"
                  : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-purple-600 dark:hover:bg-purple-400 shadow-md"
              }`}
            >
              {isDropPending ? (
                <>
                  <Lock className="w-3 h-3" />
                  Locked
                </>
              ) : added ? (
                "Added ✓"
              ) : atLimit ? (
                "At Limit"
              ) : (
                <>
                  <ShoppingCart className="w-3 h-3" />
                  Add
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
