"use client";

import Link from "next/link";
import { ShoppingCart, Package, Heart } from "lucide-react";
import { cartService } from "@/services/cartService";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import { formatPrice, truncate } from "@/lib/utils";
import { useState } from "react";

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

const categoryLabels: Record<string, string> = {
  giyim:    "Giyim",
  taki:     "Takı",
  aksesuar: "Aksesuar",
};

const categoryColors: Record<string, string> = {
  giyim:    "bg-sky-50 text-sky-600",
  taki:     "bg-violet-50 text-violet-600",
  aksesuar: "bg-emerald-50 text-emerald-600",
};

export default function ProductCard({ product }: { product: Product }) {
  const { isAuthenticated } = useAuthStore();
  const { setCart } = useCartStore();
  const [adding, setAdding]   = useState(false);
  const [added, setAdded]     = useState(false);
  const [wishlist, setWishlist] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      window.location.href = "/auth/login";
      return;
    }
    setAdding(true);
    try {
      const response = await cartService.addItem(product._id, 1);
      setCart(response.data);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (error) {
      console.error("Sepete eklenemedi:", error);
    } finally {
      setAdding(false);
    }
  };

  const isOutOfStock = product.stock === 0;

  return (
    <Link href={`/products/${product._id}`} className="group block w-full h-full">
      <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full w-full">
        {/* ── Image Container (4:3 ratio) ── */}
        <div className="relative overflow-hidden bg-gray-50" style={{ paddingBottom: "100%" }}>
          <div className="absolute inset-0">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-108 ${isOutOfStock ? "opacity-60" : ""}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "";
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                <Package size={40} strokeWidth={1.5} />
                <span className="text-xs">Görsel Yok</span>
              </div>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="bg-gray-800 text-white text-xs font-semibold px-4 py-1.5 rounded-full tracking-wide">
                Tükendi
              </span>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${categoryColors[product.category] || "bg-gray-100 text-gray-600"}`}>
              {categoryLabels[product.category] || product.category}
            </span>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWishlist(!wishlist); }}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
          >
            <Heart
              size={15}
              className={wishlist ? "fill-red-500 text-red-500" : "text-gray-400"}
            />
          </button>

          {/* Add to Cart — slides up on hover */}
          {!isOutOfStock && (
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className={`w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                  added
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-900 text-white hover:bg-orange-500"
                }`}
              >
                {adding ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Ekleniyor...
                  </>
                ) : added ? (
                  <>✓ Sepete Eklendi</>
                ) : (
                  <>
                    <ShoppingCart size={15} />
                    Sepete Ekle
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="p-4 flex flex-col flex-1">
          {/* Product Name */}
          <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-1 line-clamp-2 group-hover:text-orange-500 transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2 flex-1">
            {truncate(product.description, 70)}
          </p>

          {/* Price Row */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
            <div>
              <p className="text-lg font-bold text-gray-900 leading-none">
                {formatPrice(product.price)}
              </p>
              {product.stock > 0 && product.stock <= 5 && (
                <p className="text-xs text-red-400 mt-0.5 font-medium">
                  Son {product.stock} ürün!
                </p>
              )}
            </div>
            {product.stock > 5 && (
              <span className="text-xs text-emerald-500 font-medium">Stokta var</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}