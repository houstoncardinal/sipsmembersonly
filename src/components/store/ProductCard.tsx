import { motion } from "framer-motion";
import { ShoppingCart, Clock, Lock } from "lucide-react";
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
    <div className="flex items-center gap-1.5 text-xs font-sans font-medium text-primary">
      <Clock className="w-3 h-3" />
      {timeLeft}
    </div>
  );
}

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);

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
      className="luxury-card group"
    >
      {/* Image/Gradient Area */}
      <div className={`relative h-52 bg-gradient-to-br ${product.gradient} overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-sans font-bold tracking-widest uppercase gradient-primary text-primary-foreground">
            {product.badge}
          </div>
        )}

        {/* Category */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-sans font-medium tracking-wider uppercase glass text-foreground/70">
          {product.categoryLabel}
        </div>

        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-primary/10 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg leading-tight text-foreground group-hover:text-gradient transition-colors">
            {product.name}
          </h3>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {product.dropTime && <CountdownTimer dropTime={product.dropTime} />}

        <div className="flex items-end justify-between pt-2">
          <div>
            <p className="text-lg font-serif font-semibold text-foreground">
              ${product.price.toLocaleString()}
            </p>
            <p className="text-[10px] text-primary font-sans font-medium tracking-wide">
              ≈ {formatBtc(usdToBtc(product.price))} BTC
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            disabled={atLimit || isDropPending}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-sans font-semibold tracking-wider uppercase transition-all duration-300 ${
              added
                ? "gradient-primary text-primary-foreground"
                : atLimit
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : isDropPending
                ? "bg-muted/50 text-muted-foreground cursor-not-allowed"
                : "btn-luxury"
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

        {product.stock <= 10 && (
          <p className="text-[10px] text-destructive/80 font-sans font-medium">
            Only {product.stock} left in stock
          </p>
        )}
      </div>
    </motion.div>
  );
}
