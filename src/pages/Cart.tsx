import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useCart } from "@/context/CartContext";
import { formatBtc, usdToBtc } from "@/data/products";
import { Minus, Plus, Trash2, Bitcoin, ShoppingBag, Truck, ShieldCheck, Clock } from "lucide-react";

export default function Cart() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-6"
          >
            <ShoppingBag className="w-12 h-12 text-slate-400" />
          </motion.div>
          <h2 className="font-serif text-3xl text-slate-900 mb-3">Your Cart is Empty</h2>
          <p className="text-slate-600 mb-8 max-w-md">
            Browse our exclusive collection and add some luxury items to your cart.
          </p>
          <Link to="/dashboard" className="gradient-primary text-white px-8 py-4 rounded-xl font-sans font-semibold uppercase tracking-wider shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all hover:scale-105">
            Browse Collection
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-slate-900 mb-2">Shopping Cart</h1>
          <p className="text-slate-600">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all group"
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
                    <div className="w-28 h-28 rounded-xl overflow-hidden bg-slate-100 group-hover:scale-105 transition-transform">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product.id}`}>
                      <h3 className="font-serif text-xl text-slate-900 group-hover:text-purple-600 transition-colors truncate">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-slate-500 mt-1">{item.product.categoryLabel}</p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-purple-100 hover:text-purple-600 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-bold text-slate-900 w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.product.limitPerMember ? item.quantity >= item.product.limitPerMember : false}
                        className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-purple-100 hover:text-purple-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="text-right">
                      <p className="font-serif text-2xl font-bold text-slate-900">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-xs text-purple-600 font-mono">
                        ≈ {formatBtc(usdToBtc(item.product.price * item.quantity))} BTC
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-purple-100 border border-purple-100 sticky top-6">
              <h2 className="font-serif text-2xl text-slate-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-semibold text-slate-900">${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="h-px bg-slate-200" />
                <div className="flex justify-between items-end">
                  <span className="text-slate-900 font-semibold">Total</span>
                  <div className="text-right">
                    <p className="font-serif text-3xl font-bold text-slate-900">${total.toLocaleString()}</p>
                    <p className="text-sm text-purple-600 font-mono">
                      ≈ {formatBtc(usdToBtc(total))} BTC
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full gradient-primary text-white py-4 rounded-xl font-sans font-semibold uppercase tracking-wider shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Bitcoin className="w-5 h-5" />
                Proceed to Checkout
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Truck className="w-4 h-4 text-purple-500" />
                  <span>Free insured shipping worldwide</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                  <span>Authenticity guaranteed</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span>Secure crypto checkout</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 text-center mt-6">
                By completing your purchase, you agree to our terms of service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
