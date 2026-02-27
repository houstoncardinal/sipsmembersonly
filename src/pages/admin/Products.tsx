import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { products as initialProducts, Product } from "@/data/products";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  Save,
  Upload,
  Download,
  MoreVertical,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Tag,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Layers,
  BarChart3,
} from "lucide-react";

export default function AdminProducts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<"delete" | "hide" | "show" | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "price" | "stock">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    category: "private-drops",
    categoryLabel: "Private Drop",
    image: "",
    stock: 0,
    gradient: "from-purple-900/40 via-amber-900/20 to-black/60",
  });

  useState(() => {
    if (user?.role !== "admin") navigate("/dashboard");
  });

  if (user?.role !== "admin") return null;

  // Filter and sort products
  const filteredProducts = products
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

  // CRUD Operations
  const handleAddProduct = () => {
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: formData.name || "New Product",
      description: formData.description || "",
      price: formData.price || 0,
      category: formData.category as Product["category"],
      categoryLabel: formData.categoryLabel || "",
      image: formData.image || "/placeholder.svg",
      stock: formData.stock || 0,
      gradient: formData.gradient || "from-purple-900/40 via-amber-900/20 to-black/60",
      sku: `SKU-${Date.now()}`,
      abv: formData.abv,
      origin: formData.origin,
      weight: formData.weight,
    };
    setProducts([...products, newProduct]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditProduct = () => {
    if (!editingProduct) return;
    setProducts(products.map((p) => (p.id === editingProduct.id ? { ...p, ...formData } : p)));
    setEditingProduct(null);
    resetForm();
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleBulkAction = () => {
    if (!bulkAction) return;
    if (bulkAction === "delete") {
      setProducts(products.filter((p) => !selectedProducts.has(p.id)));
    } else if (bulkAction === "hide") {
      setProducts(products.map((p) => 
        selectedProducts.has(p.id) ? { ...p, stock: 0 } : p
      ));
    } else if (bulkAction === "show") {
      setProducts(products.map((p) => 
        selectedProducts.has(p.id) ? { ...p, stock: p.stock || 10 } : p
      ));
    }
    setSelectedProducts(new Set());
    setBulkAction(null);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "private-drops",
      categoryLabel: "",
      image: "",
      stock: 0,
      gradient: "from-purple-900/40 via-amber-900/20 to-black/60",
    });
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      categoryLabel: product.categoryLabel,
      image: product.image,
      stock: product.stock,
      gradient: product.gradient,
      abv: product.abv,
      origin: product.origin,
      weight: product.weight,
    });
  };

  const toggleProductSelection = (id: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProducts(newSelected);
  };

  const toggleAllSelection = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map((p) => p.id)));
    }
  };

  // Stats
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStockProducts = products.filter((p) => p.stock <= 10).length;
  const outOfStockProducts = products.filter((p) => p.stock === 0).length;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-4xl text-slate-900 mb-2">Product Management</h1>
              <p className="text-sm text-slate-600 font-sans">Manage your exclusive inventory</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl gradient-primary text-white font-sans font-semibold text-sm uppercase shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Products", value: products.length.toString(), icon: Package, color: "purple" },
            { label: "Inventory Value", value: `$${(totalValue / 1000).toFixed(1)}K`, icon: DollarSign, color: "green" },
            { label: "Low Stock", value: lowStockProducts.toString(), icon: AlertTriangle, color: "orange" },
            { label: "Out of Stock", value: outOfStockProducts.toString(), icon: X, color: "red" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
              <p className="text-sm text-slate-500 font-sans mb-1">{stat.label}</p>
              <p className="font-serif text-3xl font-bold text-slate-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters & Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-purple-500 bg-white"
              >
                <option value="all">All Categories</option>
                <option value="private-drops">Private Drops</option>
                <option value="collectors">Collectors</option>
                <option value="novelty">Novelty</option>
                <option value="members-exclusive">Members Exclusive</option>
              </select>
            </div>

            {/* Sort */}
            <button
              onClick={() => {
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-purple-300 transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-sans font-medium text-slate-600 capitalize">{sortBy}</span>
              {sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Bulk Actions */}
            {selectedProducts.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">{selectedProducts.size} selected</span>
                <select
                  value={bulkAction || ""}
                  onChange={(e) => setBulkAction(e.target.value as any)}
                  className="px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-purple-500"
                >
                  <option value="">Bulk Actions</option>
                  <option value="delete">Delete Selected</option>
                  <option value="hide">Hide Selected</option>
                  <option value="show">Show Selected</option>
                </select>
                <button
                  onClick={handleBulkAction}
                  disabled={!bulkAction}
                  className="px-4 py-2 rounded-lg gradient-primary text-white text-sm font-semibold disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                      onChange={toggleAllSelection}
                      className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                    />
                  </th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                  <th 
                    className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => { setSortBy("price"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}
                  >
                    Price
                  </th>
                  <th 
                    className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => { setSortBy("stock"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}
                  >
                    Stock
                  </th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="text-left p-4 text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-right p-4 text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                        className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-sans font-semibold text-slate-900">{product.name}</p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-serif text-lg font-bold text-slate-900">${product.price.toLocaleString()}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-sans font-semibold ${
                          product.stock === 0 ? "text-red-600" :
                          product.stock <= 10 ? "text-orange-600" :
                          "text-green-600"
                        }`}>
                          {product.stock} units
                        </span>
                        {product.limitPerMember && (
                          <span className="text-xs text-slate-400">({product.limitPerMember}/member)</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-sans font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-600">
                        {product.categoryLabel}
                      </span>
                    </td>
                    <td className="p-4">
                      {product.stock === 0 ? (
                        <span className="text-xs font-sans font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600">
                          Out of Stock
                        </span>
                      ) : product.stock <= 10 ? (
                        <span className="text-xs font-sans font-semibold px-2.5 py-1 rounded-full bg-orange-50 text-orange-600">
                          Low Stock
                        </span>
                      ) : (
                        <span className="text-xs font-sans font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-600">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4 text-slate-400" />
                        </button>
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 rounded-lg hover:bg-purple-50 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-purple-500" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Product Modal */}
        <AnimatePresence>
          {(showAddModal || editingProduct) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={() => { setShowAddModal(false); setEditingProduct(null); }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl">
                  <h2 className="font-serif text-2xl text-slate-900">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h2>
                  <button
                    onClick={() => { setShowAddModal(false); setEditingProduct(null); }}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="font-sans font-semibold text-slate-700 flex items-center gap-2">
                      <Package className="w-4 h-4 text-purple-500" />
                      Basic Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-sans font-medium text-slate-700 mb-2 block">Product Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                          placeholder="e.g., Midnight Reserve Bourbon"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-sans font-medium text-slate-700 mb-2 block">SKU</label>
                        <input
                          type="text"
                          value={formData.sku || ""}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                          placeholder="e.g., MRB-18Y-001"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-sans font-medium text-slate-700 mb-2 block">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 min-h-[100px]"
                        placeholder="Describe the product..."
                      />
                    </div>
                  </div>

                  {/* Pricing & Stock */}
                  <div className="space-y-4">
                    <h3 className="font-sans font-semibold text-slate-700 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-purple-500" />
                      Pricing & Inventory
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-sans font-medium text-slate-700 mb-2 block">Price (USD)</label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-sans font-medium text-slate-700 mb-2 block">Stock Quantity</label>
                        <input
                          type="number"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-sans font-medium text-slate-700 mb-2 block">Limit per Member</label>
                        <input
                          type="number"
                          value={formData.limitPerMember || 0}
                          onChange={(e) => setFormData({ ...formData, limitPerMember: parseInt(e.target.value) || undefined })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-4">
                    <h3 className="font-sans font-semibold text-slate-700 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-purple-500" />
                      Category
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-sans font-medium text-slate-700 mb-2 block">Category</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value as Product["category"] })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        >
                          <option value="private-drops">Private Drops</option>
                          <option value="collectors">Collectors</option>
                          <option value="novelty">Novelty</option>
                          <option value="members-exclusive">Members Exclusive</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-sans font-medium text-slate-700 mb-2 block">Category Label</label>
                        <input
                          type="text"
                          value={formData.categoryLabel}
                          onChange={(e) => setFormData({ ...formData, categoryLabel: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Product Specs */}
                  <div className="space-y-4">
                    <h3 className="font-sans font-semibold text-slate-700 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-500" />
                      Specifications
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-sans font-medium text-slate-700 mb-2 block">ABV</label>
                        <input
                          type="text"
                          value={formData.abv || ""}
                          onChange={(e) => setFormData({ ...formData, abv: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                          placeholder="e.g., 45.2%"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-sans font-medium text-slate-700 mb-2 block">Volume</label>
                        <input
                          type="text"
                          value={formData.weight || ""}
                          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                          placeholder="e.g., 750ml"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-sans font-medium text-slate-700 mb-2 block">Origin</label>
                        <input
                          type="text"
                          value={formData.origin || ""}
                          onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                          placeholder="e.g., Kentucky, USA"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Image URL */}
                  <div className="space-y-4">
                    <h3 className="font-sans font-semibold text-slate-700 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-purple-500" />
                      Product Image
                    </h3>
                    <div>
                      <label className="text-sm font-sans font-medium text-slate-700 mb-2 block">Image Path</label>
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        placeholder="/paiprocod.jpg"
                      />
                      <p className="text-xs text-slate-500 mt-2">Use: /paiprocod.jpg, /proonly.jpg, /qua.jpg, or /tuss.jpg</p>
                    </div>
                    {formData.image && (
                      <div className="w-32 h-32 rounded-xl overflow-hidden bg-slate-100">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white rounded-b-3xl">
                  <button
                    onClick={() => { setShowAddModal(false); setEditingProduct(null); }}
                    className="px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-sans font-semibold hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingProduct ? handleEditProduct : handleAddProduct}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-sans font-semibold shadow-lg shadow-purple-500/30"
                  >
                    <Save className="w-4 h-4" />
                    {editingProduct ? "Save Changes" : "Create Product"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
