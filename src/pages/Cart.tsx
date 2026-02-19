import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useCart } from "@/context/CartContext";
import { formatBtc, usdToBtc } from "@/data/products";
import { Minus, Plus, Trash2, Bitcoin, ShoppingBag } from "lucide-react";

export default function Cart() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h2 className="font-serif text-2xl text-foreground mb-2">Your Cart is Empty</h2>
          <p className="text-sm text-muted-foreground font-sans mb-6">
            Browse the collection and add some exclusive items.
          </p>
          <Link to="/dashboard" className="btn-luxury text-primary-foreground">
            Browse Store
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="font-serif text-3xl text-foreground mb-8 glow-text">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={item.product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-5 flex gap-5"
            >
              <div className={`w-20 h-20 rounded-lg bg-gradient-to-br ${item.product.gradient} flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-base text-foreground truncate">{item.product.name}</h3>
                <p className="text-xs text-muted-foreground font-sans mt-1">
                  ${item.product.price.toLocaleString()} each
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-md glass flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-sans font-medium text-foreground w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.product.limitPerMember ? item.quantity >= item.product.limitPerMember : false}
                    className="w-7 h-7 rounded-md glass flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors disabled:opacity-30"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-muted-foreground/50 hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <p className="font-serif text-base text-foreground">
                  ${(item.product.price * item.quantity).toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="glass-strong rounded-2xl p-6 glow-border h-fit sticky top-8">
          <h2 className="font-serif text-lg text-foreground mb-6">Order Summary</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm font-sans">
              <span className="text-muted-foreground">Items ({itemCount})</span>
              <span className="text-foreground">${total.toLocaleString()}</span>
            </div>
            <div className="h-px bg-border/30" />
            <div className="flex justify-between">
              <span className="font-serif text-lg text-foreground">Total</span>
              <div className="text-right">
                <p className="font-serif text-lg text-foreground">${total.toLocaleString()}</p>
                <p className="text-xs text-primary font-sans font-medium">
                  ≈ {formatBtc(usdToBtc(total))} BTC
                </p>
              </div>
            </div>
          </div>

          <Link
            to="/checkout"
            className="btn-luxury w-full text-primary-foreground flex items-center justify-center gap-2"
          >
            <Bitcoin className="w-4 h-4" />
            Pay with Bitcoin
          </Link>

          <p className="text-[10px] text-muted-foreground/50 text-center mt-4 font-sans">
            Crypto payments only. No refunds on digital drops.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
