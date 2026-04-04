"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users, Package, ShoppingCart, TrendingUp,
  Activity, AlertCircle, BarChart3, ArrowLeft,
  RefreshCw, CheckCircle, Database, Zap, ArrowUpRight,
  Plus, Pencil, Trash2, X, Save
} from "lucide-react";
import { adminService } from "@/services/adminService";
import { productService } from "@/services/productService";
import useAuthStore from "@/store/authStore";
import { formatPrice } from "@/lib/utils";

interface DashboardData {
  totalUsers: number;
  totalProducts: number;
  totalActiveCarts: number;
  estimatedRevenue: number;
  productsByCategory: { _id: string; count: number }[];
  systemStatus: { status: string; uptime: number; timestamp: string };
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
}

const categoryLabels: Record<string, string> = {
  giyim: "Giyim", taki: "Takı", aksesuar: "Aksesuar",
};
const categoryGradients: Record<string, string> = {
  giyim: "from-blue-500 to-blue-400",
  taki: "from-violet-500 to-violet-400",
  aksesuar: "from-emerald-500 to-emerald-400",
};
const categoryBg: Record<string, string> = {
  giyim: "bg-blue-50 text-blue-600",
  taki: "bg-violet-50 text-violet-600",
  aksesuar: "bg-emerald-50 text-emerald-600",
};

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}s ${m}d`;
  if (m > 0) return `${m}d ${s}sn`;
  return `${s}sn`;
}

const emptyForm = {
  name: "", description: "", price: "", category: "giyim", stock: "", images: ""
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const [data, setData]             = useState<DashboardData | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Products
  const [products, setProducts]         = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [activeTab, setActiveTab]       = useState<"dashboard" | "products">("dashboard");

  // Form
  const [showForm, setShowForm]         = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData]         = useState(emptyForm);
  const [formLoading, setFormLoading]   = useState(false);
  const [formError, setFormError]       = useState("");
  const [formSuccess, setFormSuccess]   = useState("");
  const [deletingId, setDeletingId]     = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/auth/login"); return; }
    if (user?.role !== "admin") { router.push("/"); return; }
    fetchDashboard();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (activeTab === "products") fetchProducts();
  }, [activeTab]);

  const fetchDashboard = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const response = await adminService.getDashboard();
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Dashboard yüklenemedi.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const response = await productService.getAll({});
      setProducts(response.data || []);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError("");
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setFormError("");
    setFormSuccess("");
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: String(product.price),
      category: product.category,
      stock: String(product.stock),
      images: product.images?.[0] || "",
    });
    setFormError("");
    setFormSuccess("");
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        images: formData.images ? [formData.images] : [],
      };

      if (editingProduct) {
        await productService.update(editingProduct._id, payload);
        setFormSuccess("Ürün başarıyla güncellendi!");
      } else {
        await productService.create(payload);
        setFormSuccess("Ürün başarıyla eklendi!");
      }

      await fetchProducts();
      await fetchDashboard(true);
      setTimeout(() => {
        setShowForm(false);
        setFormSuccess("");
      }, 1500);
    } catch (err: any) {
      setFormError(err.response?.data?.message || "İşlem başarısız.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Bu ürünü silmek istediğinizden emin misiniz?")) return;
    setDeletingId(productId);
    try {
      await productService.delete(productId);
      await fetchProducts();
      await fetchDashboard(true);
    } catch (err) {
      console.error("Silme hatası:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={36} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Erişim Reddedildi</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button onClick={() => router.push("/")} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-semibold">
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const totalCategoryProducts = data.productsByCategory.reduce((s, c) => s + c.count, 0);

  return (
    <div className="min-h-screen bg-[#f4f6f9]">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all">
              <ArrowLeft size={17} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-gray-900">Admin Paneli</h1>
                <span className="bg-orange-100 text-orange-600 text-[11px] font-bold px-2 py-0.5 rounded-full">v1.0.0</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">TikMarket yönetim merkezi</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="font-medium">Sistem Aktif</span>
            </div>
            <button onClick={() => fetchDashboard(true)} disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-all shadow-md shadow-orange-200 active:scale-95">
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              Yenile
            </button>
          </div>
        </div>

        {/* Tabs */}
<div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-3 py-4">
  <button
    onClick={() => setActiveTab("dashboard")}
    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
      activeTab === "dashboard"
        ? "bg-orange-500 text-white shadow-md shadow-orange-200"
        : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
    }`}
  >
    <BarChart3 size={16} />
    Dashboard
  </button>
  <button
    onClick={() => setActiveTab("products")}
    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
      activeTab === "products"
        ? "bg-orange-500 text-white shadow-md shadow-orange-200"
        : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
    }`}
  >
    <Package size={16} />
    Ürün Yönetimi
  </button>
</div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── DASHBOARD TAB ── */}
        {activeTab === "dashboard" && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-4 text-white shadow-lg shadow-orange-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <Users size={16} className="text-white" />
                  </div>
                  <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">Toplam</span>
                </div>
                <p className="text-4xl font-black text-center my-3">{data.totalUsers}</p>
                <p className="text-orange-100 text-xs font-medium text-center">Kayıtlı Kullanıcı</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-orange-100/80 text-[11px]">
                  <ArrowUpRight size={10} /><span>Aktif üyeler</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-4 text-white shadow-lg shadow-blue-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <Package size={16} className="text-white" />
                  </div>
                  <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">Aktif</span>
                </div>
                <p className="text-4xl font-black text-center my-3">{data.totalProducts}</p>
                <p className="text-blue-100 text-xs font-medium text-center">Toplam Ürün</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-blue-100/80 text-[11px]">
                  <ArrowUpRight size={10} /><span>3 kategoride</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl p-4 text-white shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <ShoppingCart size={16} className="text-white" />
                  </div>
                  <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">Canlı</span>
                </div>
                <p className="text-4xl font-black text-center my-3">{data.totalActiveCarts}</p>
                <p className="text-emerald-100 text-xs font-medium text-center">Aktif Sepet</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-emerald-100/80 text-[11px]">
                  <ArrowUpRight size={10} /><span>Gerçek zamanlı</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-400 to-violet-600 rounded-2xl p-4 text-white shadow-lg shadow-violet-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <TrendingUp size={16} className="text-white" />
                  </div>
                  <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">Tahmini</span>
                </div>
                <p className="text-xl font-black text-center my-3 leading-tight">{formatPrice(data.estimatedRevenue)}</p>
                <p className="text-violet-100 text-xs font-medium text-center">Toplam Gelir</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-violet-100/80 text-[11px]">
                  <ArrowUpRight size={10} /><span>Sepet toplamları</span>
                </div>
              </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center">
                      <BarChart3 size={18} className="text-orange-500" />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900">Kategori Dağılımı</h2>
                      <p className="text-xs text-gray-400">Ürünlere göre analiz</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-xl">
                    {totalCategoryProducts} ürün
                  </span>
                </div>
                <div className="space-y-5">
                  {data.productsByCategory.map((cat) => {
                    const pct = totalCategoryProducts > 0 ? Math.round((cat.count / totalCategoryProducts) * 100) : 0;
                    return (
                      <div key={cat._id}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-bold px-3 py-1 rounded-full ${categoryBg[cat._id] || "bg-gray-100 text-gray-600"}`}>
                            {categoryLabels[cat._id] || cat._id}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-400">{cat.count} ürün</span>
                            <span className="text-sm font-black text-gray-800 w-9 text-right">{pct}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                          <div className={`h-3 rounded-full bg-gradient-to-r ${categoryGradients[cat._id] || "from-gray-400 to-gray-300"} transition-all duration-700`}
                            style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-500 font-medium">Toplam Ürün</span>
                    <span className="text-2xl font-black text-gray-900">{totalCategoryProducts}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <Activity size={18} className="text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Sistem Durumu</h2>
                    <p className="text-xs text-gray-400">Canlı bilgiler</p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Zap size={13} className="text-emerald-600" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">API</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-sm font-bold text-emerald-600">Çalışıyor</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Activity size={13} className="text-gray-500" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Uptime</span>
                    </div>
                    <span className="text-sm font-black text-gray-900">{formatUptime(data.systemStatus.uptime)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center">
                        <RefreshCw size={13} className="text-gray-500" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Güncelleme</span>
                    </div>
                    <span className="text-sm font-black text-gray-900">
                      {new Date(data.systemStatus.timestamp).toLocaleTimeString("tr-TR")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Database size={13} className="text-gray-500" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Veritabanı</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span className="text-xs font-bold text-emerald-600">MongoDB Atlas</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center">
                        <CheckCircle size={13} className="text-orange-500" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Platform</span>
                    </div>
                    <span className="text-sm font-black text-orange-500">TikMarket v1.0.0</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── PRODUCTS TAB ── */}
        {activeTab === "products" && (
          <div className="space-y-5">

            {/* Product Form Modal */}
            {showForm && (
  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden mx-4">

      {/* Modal Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50 rounded-t-3xl">
        <div>
          <h2 className="text-xl font-black text-gray-900">
            {editingProduct ? "✏️ Ürünü Düzenle" : "➕ Yeni Ürün Ekle"}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {editingProduct ? "Ürün bilgilerini güncelleyin" : "Yeni ürün bilgilerini doldurun"}
          </p>
        </div>
        <button
          onClick={() => setShowForm(false)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all"
        >
          <X size={18} />
        </button>
      </div>

      {/* Modal Body */}
      <div className="px-8 py-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 100px)" }}>
        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-5">
            ⚠️ {formError}
          </div>
        )}
        {formSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-600 rounded-xl px-4 py-3 text-sm mb-5">
            ✓ {formSuccess}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-5">

          {/* Product Name */}
          <div className="space-y-2.5">
            <label className="text-xs font-black text-gray-600 uppercase tracking-wider">
              Ürün Adı *
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              required
              placeholder="Ürün adını girin"
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 transition-all placeholder:text-gray-300"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-600 uppercase tracking-wider">
              Açıklama *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              required
              placeholder="Ürün açıklaması..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 transition-all resize-none placeholder:text-gray-300"
            />
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-600 uppercase tracking-wider">
                Fiyat (₺) *
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleFormChange}
                required
                placeholder="0.00"
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 transition-all placeholder:text-gray-300"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-600 uppercase tracking-wider">
                Stok *
              </label>
              <input
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleFormChange}
                required
                placeholder="0"
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 transition-all placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-600 uppercase tracking-wider">
              Kategori *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 transition-all bg-white"
            >
              <option value="giyim">👗 Giyim</option>
              <option value="taki">💍 Takı</option>
              <option value="aksesuar">👜 Aksesuar</option>
            </select>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-600 uppercase tracking-wider">
              Görsel URL
            </label>
            <input
              name="images"
              value={formData.images}
              onChange={handleFormChange}
              placeholder="https://example.com/image.jpg"
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400 transition-all placeholder:text-gray-300"
            />
            {formData.images && (
  <div className="mt-3 flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
      <img
        src={formData.images}
        alt="preview"
        className="w-full h-full object-cover"
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
    </div>
    <div>
      <p className="text-xs font-bold text-gray-600">Görsel Önizleme</p>
      <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{formData.images}</p>
    </div>
  </div>
)}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={formLoading}
              className="flex-1 h-12 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-orange-200 active:scale-95"
            >
              {formLoading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : (
                <Save size={18} />
              )}
              {editingProduct ? "Değişiklikleri Kaydet" : "Ürünü Ekle"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 h-12 border-2 border-gray-200 hover:bg-gray-50 text-gray-600 font-bold rounded-xl transition-all"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

            {/* Products Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-gray-900">Ürün Yönetimi</h2>
                <p className="text-sm text-gray-400 mt-0.5">{products.length} ürün listeleniyor</p>
              </div>
              <button onClick={openAddForm}
                className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-orange-200 active:scale-95">
                <Plus size={16} />
                Yeni Ürün Ekle
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {productsLoading ? (
                <div className="py-16 text-center">
                  <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : products.length === 0 ? (
                <div className="py-16 text-center">
                  <Package size={40} className="mx-auto text-gray-200 mb-3" strokeWidth={1.5} />
                  <p className="text-gray-400 font-medium">Henüz ürün yok</p>
                  <button onClick={openAddForm} className="mt-3 text-orange-500 text-sm font-bold hover:underline">
                    İlk ürünü ekle
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Ürün</th>
                        <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Kategori</th>
                        <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Fiyat</th>
                        <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Stok</th>
                        <th className="text-right px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {products.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                {product.images?.[0] ? (
                                  <img src={product.images[0]} alt={product.name}
                                    className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package size={16} className="text-gray-300" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-gray-900 text-sm truncate max-w-[180px]">{product.name}</p>
                                <p className="text-xs text-gray-400 truncate max-w-[180px]">{product.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryBg[product.category] || "bg-gray-100 text-gray-600"}`}>
                              {categoryLabels[product.category] || product.category}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="font-bold text-gray-900 text-sm">{formatPrice(product.price)}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`text-sm font-bold ${product.stock === 0 ? "text-red-500" : product.stock <= 5 ? "text-amber-500" : "text-emerald-500"}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => openEditForm(product)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold transition-all">
                                <Pencil size={13} />
                                Düzenle
                              </button>
                              <button onClick={() => handleDelete(product._id)}
                                disabled={deletingId === product._id}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-all disabled:opacity-40">
                                {deletingId === product._id ? (
                                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                  </svg>
                                ) : <Trash2 size={13} />}
                                Sil
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}