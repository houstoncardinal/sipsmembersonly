import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { products, formatBtc, usdToBtc } from "@/data/products";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/store/ProductCard";
import {
  ShoppingCart,
  Clock,
  Lock,
  ChevronLeft,
  Share2,
  Heart,
  Info,
  Package,
  Truck,
  ShieldCheck,
  ChevronRight,
  ChevronLeft as ChevronLeftIcon,
  ZoomIn,
  Award,
  Droplets,
  TrendingUp,
} from "lucide-react";

// Product images from public folder
const PRODUCT_IMAGES = [
  "/paiprocod.jpg",
  "/proonly.jpg",
  "/qua.jpg",
  "/tuss.jpg",
];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "specs" | "reviews">("details");

  const product = products.find((p) => p.id === id);

  const cartItem = items.find((i) => i.product.id === product?.id);
  const atLimit = product?.limitPerMember
    ? (cartItem?.quantity ?? 0) >= product.limitPerMember
    : false;

  const isDropPending = product?.dropTime
    ? new Date(product.dropTime).getTime() > Date.now()
    : false;

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % PRODUCT_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!product?.dropTime) return;
    const update = () => {
      const diff = new Date(product.dropTime!).getTime() - Date.now();
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
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [product?.dropTime]);

  if (!product) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-32">
          <h2 className="font-serif text-2xl text-slate-900 mb-2">Product Not Found</h2>
          <Link to="/dashboard" className="btn-luxury text-white mt-4">
            Back to Store
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleAddToCart = () => {
    if (atLimit || isDropPending) return;
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-purple-600 transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Store
        </button>

        {/* Product Hero */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 shadow-2xl group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={PRODUCT_IMAGES[selectedImage]}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setIsZoomed(!isZoomed)}
                />
              </AnimatePresence>

              {/* Zoom Indicator */}
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="absolute top-4 right-4 p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ZoomIn className="w-5 h-5 text-slate-700" />
              </button>

              {/* Navigation Arrows */}
              <button
                onClick={() => setSelectedImage((prev) => (prev - 1 + PRODUCT_IMAGES.length) % PRODUCT_IMAGES.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronLeftIcon className="w-5 h-5 text-slate-700" />
              </button>
              <button
                onClick={() => setSelectedImage((prev) => (prev + 1) % PRODUCT_IMAGES.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronRight className="w-5 h-5 text-slate-700" />
              </button>

              {/* Badge */}
              {product.badge && (
                <div className="absolute top-4 left-4 px-4 py-2 rounded-lg text-[10px] font-sans font-bold tracking-widest uppercase gradient-primary text-white shadow-lg">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-3 mt-4">
              {PRODUCT_IMAGES.map((img, i) => (
                <motion.button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i
                      ? "border-purple-500 shadow-lg shadow-purple-500/30"
                      : "border-slate-200 hover:border-purple-300"
                  }`}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-purple-300 hover:text-purple-600 transition-all shadow-sm">
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-purple-300 hover:text-purple-600 transition-all shadow-sm">
                <Heart className="w-4 h-4" />
                Wishlist
              </button>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            {/* Category & Title */}
            <div className="mb-2">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-sans font-bold tracking-wider uppercase bg-purple-100 text-purple-600 mb-3">
                {product.categoryLabel}
              </span>
              <h1 className="font-serif text-4xl lg:text-5xl text-slate-900 mb-2">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6">
              <p className="font-serif text-4xl text-purple-600 font-bold">
                ${product.price.toLocaleString()}
              </p>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-50">
                <span className="text-xs text-purple-600 font-mono font-medium">
                  {formatBtc(usdToBtc(product.price))} BTC
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-600 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Countdown Timer */}
            {product.dropTime && (
              <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-2xl p-5 mb-6 border border-purple-200">
                <div className="flex items-center gap-2 text-xs text-purple-600 font-sans font-semibold mb-2">
                  <Clock className="w-4 h-4" />
                  {isDropPending ? "Drop starts in" : "Drop live now!"}
                </div>
                <p className="font-serif text-3xl text-slate-900 tracking-wider font-mono">
                  {timeLeft}
                </p>
              </div>
            )}

            {/* Stock & Limits */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {product.limitPerMember && (
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-purple-500" />
                    <p className="text-xs text-slate-500 font-sans">Limit per Member</p>
                  </div>
                  <p className="text-xl font-serif font-bold text-slate-900">{product.limitPerMember} bottles</p>
                </div>
              )}
              <div className={`rounded-xl p-4 border shadow-sm ${
                product.stock <= 10 
                  ? "bg-red-50 border-red-200" 
                  : "bg-white border-slate-200"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Package className={`w-4 h-4 ${product.stock <= 10 ? "text-red-500" : "text-purple-500"}`} />
                  <p className="text-xs text-slate-500 font-sans">Available Stock</p>
                </div>
                <p className={`text-xl font-serif font-bold ${
                  product.stock <= 10 ? "text-red-600" : "text-slate-900"
                }`}>
                  {product.stock} bottles
                </p>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600 font-sans">Quantity</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:border-purple-300 hover:text-purple-600 transition-all disabled:opacity-30 shadow-sm"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-lg font-serif font-bold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={product.limitPerMember ? quantity >= product.limitPerMember : false}
                    className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:border-purple-300 hover:text-purple-600 transition-all disabled:opacity-30 shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={atLimit || isDropPending}
                className={`w-full py-4 rounded-xl text-sm font-sans font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg ${
                  added
                    ? "gradient-primary text-white shadow-purple-500/30"
                    : atLimit
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : isDropPending
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-slate-900 text-white hover:bg-purple-600 shadow-slate-900/20"
                }`}
              >
                {isDropPending ? (
                  <>
                    <Lock className="w-4 h-4" />
                    Locked Until Drop
                  </>
                ) : added ? (
                  "✓ Added to Cart"
                ) : atLimit ? (
                  "At Purchase Limit"
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </>
                )}
              </motion.button>

              {atLimit && (
                <p className="text-xs text-red-500 text-center font-sans">
                  You've reached the maximum quantity for this product
                </p>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50">
                <Truck className="w-5 h-5 text-purple-500 mb-2" />
                <span className="text-[10px] text-slate-600 font-sans">Free Insured Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50">
                <ShieldCheck className="w-5 h-5 text-purple-500 mb-2" />
                <span className="text-[10px] text-slate-600 font-sans">Authenticity Guaranteed</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50">
                <Award className="w-5 h-5 text-purple-500 mb-2" />
                <span className="text-[10px] text-slate-600 font-sans">Members Exclusive</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex gap-2 mb-6 border-b border-slate-200">
            {(["details", "specs", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-sans font-semibold uppercase tracking-wider transition-all ${
                  activeTab === tab
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <Info className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-serif text-xl text-slate-900 mb-3">About This Product</h3>
                    <p className="text-slate-600 leading-relaxed">
                      This exclusive product is part of our curated collection for verified members only. 
                      Each item is carefully sourced and authenticated. Crypto payments ensure privacy 
                      and security for all transactions. Orders are processed immediately upon blockchain 
                      confirmation.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "specs" && product.abv && (
              <motion.div
                key="specs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  {product.abv && (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50">
                      <Droplets className="w-8 h-8 text-purple-500" />
                      <div>
                        <p className="text-xs text-slate-500 font-sans">ABV</p>
                        <p className="text-lg font-serif font-bold text-slate-900">{product.abv}</p>
                      </div>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50">
                      <Package className="w-8 h-8 text-purple-500" />
                      <div>
                        <p className="text-xs text-slate-500 font-sans">Volume</p>
                        <p className="text-lg font-serif font-bold text-slate-900">{product.weight}</p>
                      </div>
                    </div>
                  )}
                  {product.origin && (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50">
                      <TrendingUp className="w-8 h-8 text-purple-500" />
                      <div>
                        <p className="text-xs text-slate-500 font-sans">Origin</p>
                        <p className="text-lg font-serif font-bold text-slate-900">{product.origin}</p>
                      </div>
                    </div>
                  )}
                  {product.sku && (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50">
                      <Award className="w-8 h-8 text-purple-500" />
                      <div>
                        <p className="text-xs text-slate-500 font-sans">SKU</p>
                        <p className="text-lg font-serif font-bold text-slate-900">{product.sku}</p>
                      </div>
                    </div>
                  )}
                </div>
                {product.tastingNotes && (
                  <div className="mt-6">
                    <h4 className="font-serif text-lg text-slate-900 mb-3">Tasting Notes</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tastingNotes.map((note, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-sans font-medium"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "reviews" && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center"
              >
                <p className="text-slate-500">Reviews coming soon for verified purchasers.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="font-serif text-2xl text-slate-900 mb-6">You May Also Like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
