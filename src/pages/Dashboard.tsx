import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProductCard from "@/components/store/ProductCard";
import { products, categories } from "@/data/products";
import { Search } from "lucide-react";

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

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl lg:text-4xl text-foreground mb-1 glow-text">
          The Collection
        </h1>
        <p className="text-sm text-muted-foreground font-sans">
          Exclusive selections for verified members
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-luxury pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-xs font-sans font-medium tracking-wider transition-all duration-300 ${
                activeCategory === cat.id
                  ? "gradient-primary text-primary-foreground"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filtered.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground font-sans">No products match your search.</p>
        </div>
      )}
    </DashboardLayout>
  );
}
