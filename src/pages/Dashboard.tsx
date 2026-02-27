import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProductCard from "@/components/store/ProductCard";
import { products, categories } from "@/data/products";
import { Search, Sparkles, Filter, Crown } from "lucide-react";

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featuredProducts = products.filter((p) => p.badge).slice(0, 3);

  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Crown className="w-6 h-6 text-purple-500" />
          <h1 className="font-serif text-4xl lg:text-5xl text-slate-900">
            The Collection
          </h1>
        </div>
        <p className="text-sm text-slate-600 font-sans">
          Exclusive selections for verified members
        </p>
      </motion.div>

      {/* Featured Carousel */}
      {featuredProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h2 className="font-serif text-xl text-slate-900">
              Featured Drops
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative group cursor-pointer"
              >
                <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      {product.badge && (
                        <span className="px-2 py-1 rounded-md text-[10px] font-sans font-bold tracking-widest uppercase gradient-primary text-white">
                          {product.badge}
                        </span>
                      )}
                      <span className="px-2 py-1 rounded-md text-[10px] font-sans font-medium uppercase backdrop-blur-md bg-white/20 text-white">
                        {product.categoryLabel}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl text-white mb-1">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="font-serif text-lg text-purple-300">
                        ${product.price.toLocaleString()}
                      </p>
                      <span className="text-xs text-white/60">View Details →</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Search + Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-purple-500" />
          <h2 className="font-serif text-xl text-slate-900">
            Browse All
          </h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
            />
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-sans font-semibold tracking-wider uppercase transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "gradient-primary text-white shadow-lg shadow-purple-500/30"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-purple-300 hover:text-purple-600"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Product Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filtered.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </motion.div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-lg font-serif text-slate-900">No products found</p>
          <p className="text-sm mt-2 text-slate-600">Try adjusting your search or filters</p>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
