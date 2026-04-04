"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart, Trash2, Plus, Minus,
  Package, ArrowLeft, ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cartService } from "@/services/cartService";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
    isActive: boolean;
  };
  quantity: number;
  priceAtTime: number;
}

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { setCart, clearCart } = useCartStore();

  const [items, setItems]             = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [updatingId, setUpdatingId]   = useState<string | null>(null);
  const [removingId, setRemovingId]   = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    fetchCart();
  }, [isAuthenticated]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await cartService.getCart();
      setItems(response.data?.items || []);
      setTotalAmount(response.data?.totalAmount || 0);
      setCart(response.data);
    } catch {
      setError("Sepet yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdatingId(itemId);
    try {
      const response = await cartService.updateItem(itemId, newQuantity);
      setItems(response.data?.items || []);
      setTotalAmount(response.data?.totalAmount || 0);
      setCart(response.data);
    } catch (err) {
      console.error("Güncelleme hatası:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setRemovingId(itemId);
    try {
      const response = await cartService.removeItem(itemId);
      setItems(response.data?.items || []);
      setTotalAmount(response.data?.totalAmount || 0);
      setCart(response.data);
    } catch (err) {
      console.error("Silme hatası:", err);
    } finally {
      setRemovingId(null);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 flex gap-4 border border-gray-100">
              <div className="w-24 h-24 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
                <div className="h-8 bg-gray-200 rounded w-1/3 mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Empty Cart ──
  if (!loading && items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <ShoppingCart size={80} className="mx-auto text-gray-200 mb-6" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Sepetiniz Boş
          </h2>
          <p className="text-gray-400 mb-8">
            Sepetinize henüz ürün eklemediniz.
          </p>
          <Link href="/">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 h-12 text-base">
              <ShoppingBag size={18} className="mr-2" />
              Alışverişe Başla
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Sepetim</h1>
            <p className="text-gray-400 text-sm">{items.length} ürün</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Cart Items ── */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4 hover:border-orange-200 transition-colors"
              >
                {/* Product Image */}
                <Link href={`/products/${item.product._id}`}>
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.product.images && item.product.images.length > 0 ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Package size={32} />
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.product._id}`}>
                    <h3 className="font-semibold text-gray-800 hover:text-orange-500 transition-colors truncate">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-orange-500 font-bold mt-1">
                    {formatPrice(item.priceAtTime)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                        disabled={updatingId === item._id || item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-40"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold text-gray-800">
                        {updatingId === item._id ? (
                          <svg className="animate-spin h-3.5 w-3.5 mx-auto text-orange-500" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                        ) : (
                          item.quantity
                        )}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                        disabled={updatingId === item._id}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-40"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <span className="text-sm text-gray-500">
                      = <span className="font-semibold text-gray-700">
                        {formatPrice(item.priceAtTime * item.quantity)}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  disabled={removingId === item._id}
                  className="text-gray-300 hover:text-red-400 transition-colors self-start mt-1 disabled:opacity-40"
                >
                  {removingId === item._id ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* ── Order Summary ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-6">
                Sipariş Özeti
              </h2>

              {/* Items breakdown */}
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-gray-500 truncate flex-1 mr-2">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-gray-700 flex-shrink-0">
                      {formatPrice(item.priceAtTime * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Toplam</span>
                  <span className="text-2xl font-bold text-orange-500">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link href="/checkout" className="w-full">
  <Button className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base rounded-xl">
    Siparişi Tamamla
  </Button>
</Link>
              {/* Continue Shopping */}
              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full h-10 mt-3 text-sm border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500"
                >
                  Alışverişe Devam Et
                </Button>
              </Link>

              {/* Free shipping note */}
              <p className="text-xs text-gray-400 text-center mt-4">
                🚚 500₺ üzeri siparişlerde ücretsiz kargo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}