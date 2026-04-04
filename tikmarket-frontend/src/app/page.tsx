"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Package, Sparkles, ChevronRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { productService } from "@/services/productService";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  seller?: { name: string };
}

const categories = [
  { value: "",         label: "Tümü"     },
  { value: "giyim",    label: "Giyim"    },
  { value: "taki",     label: "Takı"     },
  { value: "aksesuar", label: "Aksesuar" },
];

function HomePage() {
  const searchParams = useSearchParams();
  const [products, setProducts]         = useState<Product[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [search, setSearch]             = useState("");
  const [searchInput, setSearchInput]   = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  // Sync category from URL
  useEffect(() => {
    const cat = searchParams.get("category") || "";
    setActiveCategory(cat);
    setSearch("");
    setSearchInput("");
  }, [searchParams]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await productService.getAll({ category: activeCategory, search });
      setProducts(response.data || []);
    } catch {
      setError("Ürünler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [activeCategory, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleCategoryChange = (value: string) => {
    setActiveCategory(value);
    setSearch("");
    setSearchInput("");
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]">

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative w-full py-20 md:py-28 flex flex-col items-center justify-center text-center px-6">

          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-7">
            <Sparkles size={13} className="text-orange-400" />
            <span className="text-orange-300 text-xs font-semibold tracking-widest uppercase">
              Yeni Sezon Koleksiyonu
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-white text-center mb-5">
            Moda &amp; Stil{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">
              Dünyası
            </span>
          </h1>

          <p className="text-gray-400 text-lg text-center mb-10 max-w-xl leading-relaxed">
            Giyim, takı ve aksesuar kategorilerinde binlerce ürün — hepsi bir arada.
          </p>

          {/* Search */}
          <div className="w-full max-w-2xl mx-auto mb-10">
            <form onSubmit={handleSearch}>
              <div
                className="flex items-center bg-white rounded-2xl shadow-2xl shadow-black/40"
                style={{ height: "64px", padding: "6px 6px 6px 20px" }}
              >
                <Search size={20} className="text-gray-400 flex-shrink-0 mr-3" />
                <input
                  type="text"
                  placeholder="Ürün, kategori veya marka ara..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="flex-1 text-gray-800 text-base outline-none placeholder:text-gray-400 bg-transparent min-w-0"
                />
                <button
                  type="submit"
                  className="flex-shrink-0 ml-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-base rounded-xl px-8 active:scale-95 transition-all shadow-lg shadow-orange-500/30"
                  style={{ height: "52px" }}
                >
                  Ara
                </button>
              </div>
            </form>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 text-white/70">
            <div className="flex items-center gap-2">
              <span>🛍️</span>
              <span className="text-sm font-medium">12+ Ürün</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <span>📦</span>
              <span className="text-sm font-medium">Hızlı Kargo</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <span>🔒</span>
              <span className="text-sm font-medium">Güvenli Ödeme</span>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-white border-b-2 border-gray-100 shadow-md sticky top-16 z-30">
        <div className="w-full flex items-center justify-center gap-4 py-5 px-4">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-8 py-3 rounded-2xl text-base font-bold border-2 transition-all duration-200 ${
                activeCategory === cat.value
                  ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-200 scale-105"
                  : "bg-white text-gray-700 border-gray-200 hover:border-orange-400 hover:text-orange-500 hover:scale-105"
              }`}
            >
              {cat.label}
            </button>
          ))}
          <div className="w-px h-6 bg-gray-200 mx-1" />
          {!loading && (
            <span className="text-sm text-gray-400 font-semibold bg-gray-100 px-4 py-2 rounded-xl">
              {products.length} ürün
            </span>
          )}
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="w-full px-3 py-8">

  {search && !loading && (
    <div className="flex items-center justify-between mb-6 bg-white rounded-xl px-5 py-3 border border-gray-100 max-w-screen-2xl mx-auto">
      <p className="text-sm text-gray-500">
        <span className="font-semibold text-gray-800">"{search}"</span> için {products.length} sonuç
      </p>
      <button
        onClick={() => { setSearch(""); setSearchInput(""); }}
        className="text-xs text-orange-500 hover:underline font-semibold"
      >
        Temizle ×
      </button>
    </div>
  )}

  {/* Skeleton */}
  {loading && (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 w-full">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
          <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200" />
          <div className="p-4 space-y-2.5">
            <div className="h-3.5 bg-gray-100 rounded-lg w-4/5" />
            <div className="h-3 bg-gray-100 rounded-lg w-3/5" />
            <div className="h-5 bg-gray-100 rounded-lg w-2/5 mt-3" />
          </div>
        </div>
      ))}
    </div>
  )}

  {/* Error */}
  {error && !loading && (
    <div className="text-center py-24">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Package size={32} className="text-red-300" />
      </div>
      <p className="text-red-400 font-medium mb-4">{error}</p>
      <button
        onClick={fetchProducts}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold"
      >
        Tekrar Dene
      </button>
    </div>
  )}

  {/* Empty */}
  {!loading && !error && products.length === 0 && (
    <div className="text-center py-24">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <Package size={32} className="text-gray-300" strokeWidth={1.5} />
      </div>
      <h3 className="text-gray-700 font-semibold text-lg mb-2">Ürün Bulunamadı</h3>
      <p className="text-gray-400 text-sm mb-6">
        {search ? `"${search}" için sonuç yok` : "Bu kategoride henüz ürün eklenmemiş"}
      </p>
      {search && (
        <button
          onClick={() => { setSearch(""); setSearchInput(""); }}
          className="border border-gray-200 hover:border-orange-300 text-gray-600 hover:text-orange-500 px-5 py-2 rounded-xl text-sm font-medium"
        >
          Aramayı Temizle
        </button>
      )}
    </div>
  )}

  {/* Grid */}
  {!loading && !error && products.length > 0 && (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 w-full">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {products.length >= 8 && (
        <div className="text-center mt-16 pb-4">
          <p className="text-gray-400 text-sm mb-2">Tüm ürünleri görüntülüyorsunuz</p>
          <div className="flex items-center justify-center gap-1 text-orange-500 text-sm font-medium">
            <ChevronRight size={16} />
            <span>Yeni ürünler yakında ekleniyor</span>
          </div>
        </div>
      )}
    </>
  )}
</section>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <HomePage />
    </Suspense>
  );
}