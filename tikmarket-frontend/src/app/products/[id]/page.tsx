"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, ShoppingCart, Package,
  Tag, Layers, CheckCircle, XCircle,
  Minus, Plus, Heart, Share2, Star
} from "lucide-react";
import { productService } from "@/services/productService";
import { cartService } from "@/services/cartService";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  seller?: { name: string; email: string };
  createdAt: string;
}

const categoryLabels: Record<string, string> = {
  giyim: "Giyim", taki: "Takı", aksesuar: "Aksesuar",
};

const categoryColors: Record<string, string> = {
  giyim:    "bg-blue-100 text-blue-700 border-blue-200",
  taki:     "bg-violet-100 text-violet-700 border-violet-200",
  aksesuar: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { setCart } = useCartStore();

  const [product, setProduct]             = useState<Product | null>(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [quantity, setQuantity]           = useState(1);
  const [adding, setAdding]               = useState(false);
  const [added, setAdded]                 = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlisted, setWishlisted]       = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getById(id as string);
        setProduct(response.data);
      } catch {
        setError("Ürün bulunamadı.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { router.push("/auth/login"); return; }
    setAdding(true);
    try {
      const response = await cartService.addItem(product!._id, quantity);
      setCart(response.data);
      setAdded(true);
      setTimeout(() => setAdded(false), 3000);
    } catch (err) {
      console.error("Sepete eklenemedi:", err);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f8f8]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded-xl w-32 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="aspect-square bg-gray-200 rounded-3xl" />
              <div className="space-y-4 pt-4">
                <div className="h-8 bg-gray-200 rounded-xl w-3/4" />
                <div className="h-4 bg-gray-200 rounded-xl w-full" />
                <div className="h-4 bg-gray-200 rounded-xl w-2/3" />
                <div className="h-12 bg-gray-200 rounded-xl w-1/3 mt-6" />
                <div className="h-14 bg-gray-200 rounded-xl mt-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={36} className="text-gray-300" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-bold text-gray-600 mb-2">{error || "Ürün bulunamadı"}</h2>
          <button onClick={() => router.push("/")}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-all">
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors mb-8 group"
        >
          <div className="w-9 h-9 bg-white rounded-xl border border-gray-200 flex items-center justify-center group-hover:border-orange-300 group-hover:bg-orange-50 transition-all">
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span className="text-sm font-semibold">Ürünlere Geri Dön</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── Left: Images ── */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm relative group">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-3">
                  <Package size={64} strokeWidth={1} />
                  <span className="text-sm">Görsel Yok</span>
                </div>
              )}

              {/* Wishlist button */}
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center hover:scale-110 transition-all"
              >
                <Heart
                  size={18}
                  className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
                />
              </button>

              {/* Stock badge */}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-3xl">
                  <span className="bg-white text-gray-800 font-bold px-6 py-2 rounded-full text-sm">
                    Stokta Yok
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-orange-500 shadow-md shadow-orange-100"
                        : "border-gray-200 hover:border-orange-300"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Product Info ── */}
          <div className="flex flex-col gap-5">

            {/* Category + Status */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${categoryColors[product.category] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                {categoryLabels[product.category] || product.category}
              </span>
              {product.stock > 0 ? (
                <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                  <CheckCircle size={13} />
                  Stokta Var
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-red-500 text-xs font-bold bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
                  <XCircle size={13} />
                  Tükendi
                </span>
              )}
              {product.stock > 0 && product.stock <= 5 && (
                <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                  ⚠️ Son {product.stock} ürün!
                </span>
              )}
            </div>

            {/* Product Name */}
            <div>
              <h1 className="text-3xl font-black text-gray-900 leading-tight mb-3">
                {product.name}
              </h1>
              <p className="text-gray-500 leading-relaxed text-sm">
                {product.description}
              </p>
            </div>

            {/* Rating placeholder */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={14} className={s <= 4 ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"} />
                ))}
              </div>
              <span className="text-xs text-gray-400 font-medium">4.0 · 24 değerlendirme</span>
            </div>

            {/* Price */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-xs text-gray-400 font-medium mb-1">Fiyat</p>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-orange-500">
                  {formatPrice(product.price)}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">KDV dahil fiyat</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Tag size={16} className="text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Kategori</p>
                  <p className="text-sm font-bold text-gray-800">
                    {categoryLabels[product.category] || product.category}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Layers size={16} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Stok</p>
                  <p className="text-sm font-bold text-gray-800">{product.stock} adet</p>
                </div>
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-gray-700">Adet:</span>
                  <div className="flex items-center bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-black text-gray-900 text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-xs text-gray-400">Maks: {product.stock}</span>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className={`w-full h-14 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 ${
                    added
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200"
                      : "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200"
                  }`}
                >
                  {adding ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Ekleniyor...
                    </>
                  ) : added ? (
                    <>
                      <CheckCircle size={20} />
                      Sepete Eklendi! ✓
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      Sepete Ekle — {formatPrice(product.price * quantity)}
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Seller + Trust badges */}
            <div className="space-y-3">
              {product.seller && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-500 font-black text-[10px]">
                      {product.seller.name?.charAt(0)}
                    </span>
                  </div>
                  <span>Satıcı: <span className="font-semibold text-gray-600">{product.seller.name}</span></span>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: "🚚", label: "Hızlı Kargo" },
                  { icon: "🔒", label: "Güvenli Ödeme" },
                  { icon: "↩️", label: "Kolay İade" },
                ].map((badge) => (
                  <div key={badge.label} className="bg-white border border-gray-100 rounded-xl p-3 text-center">
                    <div className="text-lg mb-1">{badge.icon}</div>
                    <p className="text-[11px] font-semibold text-gray-500">{badge.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}