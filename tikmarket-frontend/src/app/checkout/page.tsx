"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, MapPin, Plus, ShoppingBag,
  CheckCircle, Package, CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cartService } from "@/services/cartService";
import { userService } from "@/services/userService";
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
  };
  quantity: number;
  priceAtTime: number;
}

interface Address {
  _id: string;
  title: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  addressLine: string;
  postalCode?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { clearCart } = useCartStore();

  const [items, setItems]                   = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount]       = useState(0);
  const [addresses, setAddresses]           = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [loading, setLoading]               = useState(true);
  const [orderPlaced, setOrderPlaced]       = useState(false);
  const [placingOrder, setPlacingOrder]     = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savingAddress, setSavingAddress]   = useState(false);

  const [newAddress, setNewAddress] = useState({
    title: "", fullName: "", phone: "",
    city: "", district: "", addressLine: "", postalCode: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const cartResponse = await cartService.getCart();
      const cartItems = cartResponse.data?.items || [];
      setItems(cartItems);
      setTotalAmount(cartResponse.data?.totalAmount || 0);

      if (cartItems.length === 0) {
        router.push("/cart");
        return;
      }

      // Load addresses from user data
      const storedUser = localStorage.getItem("tikmarket_user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setAddresses(userData.addresses || []);
        if (userData.addresses?.length > 0) {
          setSelectedAddress(userData.addresses[0]._id);
        }
      }
    } catch (err) {
      console.error("Veri yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const response = await userService.addAddress(newAddress);
      const updatedAddresses = response.data;
      setAddresses(updatedAddresses);
      if (updatedAddresses.length > 0) {
        setSelectedAddress(updatedAddresses[updatedAddresses.length - 1]._id);
      }
      setShowAddressForm(false);
      setNewAddress({
        title: "", fullName: "", phone: "",
        city: "", district: "", addressLine: "", postalCode: "",
      });
    } catch (err) {
      console.error("Adres eklenemedi:", err);
    } finally {
      setSavingAddress(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress && addresses.length > 0) {
      alert("Lütfen bir teslimat adresi seçin!");
      return;
    }
    setPlacingOrder(true);
    // Simulate order placement (in real app this would call an orders API)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setOrderPlaced(true);
    clearCart();
    setPlacingOrder(false);
  };

  // ── Order Success Screen ──
  if (orderPlaced) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Siparişiniz Alındı! 🎉
          </h1>
          <p className="text-gray-500 mb-2">
            Siparişiniz başarıyla oluşturuldu.
          </p>
          <p className="text-gray-400 text-sm mb-8">
            Kargo takip bilgileriniz e-posta adresinize gönderilecektir.
          </p>
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-8">
            <p className="text-orange-600 font-semibold text-lg">
              Toplam: {formatPrice(totalAmount)}
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Link href="/">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6">
                <ShoppingBag size={16} className="mr-2" />
                Alışverişe Devam Et
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-gray-200 rounded-2xl" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  const selectedAddressData = addresses.find(a => a._id === selectedAddress);

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
            <h1 className="text-2xl font-bold text-gray-800">Siparişi Tamamla</h1>
            <p className="text-gray-400 text-sm">{items.length} ürün</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Address + Items ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <MapPin size={20} className="text-orange-500" />
                  <h2 className="font-bold text-gray-800">Teslimat Adresi</h2>
                </div>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="flex items-center gap-1 text-orange-500 hover:text-orange-600 text-sm font-medium"
                >
                  <Plus size={16} />
                  Yeni Adres
                </button>
              </div>

              {/* New Address Form */}
              {showAddressForm && (
                <form onSubmit={handleSaveAddress} className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Başlık *</Label>
                      <Input placeholder="Ev, İş..." value={newAddress.title}
                        onChange={e => setNewAddress({...newAddress, title: e.target.value})}
                        required className="h-9 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Ad Soyad *</Label>
                      <Input placeholder="Alıcı adı" value={newAddress.fullName}
                        onChange={e => setNewAddress({...newAddress, fullName: e.target.value})}
                        required className="h-9 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Telefon *</Label>
                      <Input placeholder="05XX XXX XX XX" value={newAddress.phone}
                        onChange={e => setNewAddress({...newAddress, phone: e.target.value})}
                        required className="h-9 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Şehir *</Label>
                      <Input placeholder="İstanbul" value={newAddress.city}
                        onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                        required className="h-9 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">İlçe *</Label>
                      <Input placeholder="Kadıköy" value={newAddress.district}
                        onChange={e => setNewAddress({...newAddress, district: e.target.value})}
                        required className="h-9 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Posta Kodu</Label>
                      <Input placeholder="34710" value={newAddress.postalCode}
                        onChange={e => setNewAddress({...newAddress, postalCode: e.target.value})}
                        className="h-9 text-sm" />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <Label className="text-xs">Açık Adres *</Label>
                      <Input placeholder="Mahalle, sokak, bina no..." value={newAddress.addressLine}
                        onChange={e => setNewAddress({...newAddress, addressLine: e.target.value})}
                        required className="h-9 text-sm" />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button type="submit" disabled={savingAddress}
                      className="bg-orange-500 hover:bg-orange-600 text-white h-9 text-sm">
                      {savingAddress ? "Kaydediliyor..." : "Kaydet"}
                    </Button>
                    <Button type="button" variant="outline"
                      onClick={() => setShowAddressForm(false)} className="h-9 text-sm">
                      İptal
                    </Button>
                  </div>
                </form>
              )}

              {/* Address List */}
              {addresses.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <MapPin size={40} className="mx-auto mb-2 text-gray-200" />
                  <p className="text-sm">Kayıtlı adres yok.</p>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="text-orange-500 text-sm mt-1 hover:underline"
                  >
                    Adres ekleyin
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <label
                      key={address._id}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedAddress === address._id
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-100 hover:border-orange-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address._id}
                        checked={selectedAddress === address._id}
                        onChange={() => setSelectedAddress(address._id)}
                        className="mt-1 accent-orange-500"
                      />
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{address.title}</p>
                        <p className="text-gray-600 text-sm">{address.fullName} — {address.phone}</p>
                        <p className="text-gray-400 text-xs mt-0.5">
                          {address.addressLine}, {address.district}/{address.city}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Package size={20} className="text-orange-500" />
                <h2 className="font-bold text-gray-800">Ürünler</h2>
              </div>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.product.images?.[0] ? (
                        <img src={item.product.images[0]} alt={item.product.name}
                          className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Package size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">
                        {item.product.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {item.quantity} adet × {formatPrice(item.priceAtTime)}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-700 text-sm flex-shrink-0">
                      {formatPrice(item.priceAtTime * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h2 className="font-bold text-gray-800 mb-5">Sipariş Özeti</h2>

              <div className="space-y-2 mb-4">
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

              <div className="border-t border-gray-100 pt-3 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Ara Toplam</span>
                  <span className="text-gray-700">{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Kargo</span>
                  <span className={totalAmount >= 500 ? "text-green-500 font-medium" : "text-gray-700"}>
                    {totalAmount >= 500 ? "Ücretsiz 🎉" : formatPrice(29.99)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">Toplam</span>
                  <span className="text-2xl font-bold text-orange-500">
                    {formatPrice(totalAmount >= 500 ? totalAmount : totalAmount + 29.99)}
                  </span>
                </div>
              </div>

              {/* Delivery Address Summary */}
              {selectedAddressData && (
                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                  <p className="text-xs text-gray-400 mb-1">Teslimat Adresi</p>
                  <p className="text-sm font-medium text-gray-700">{selectedAddressData.title}</p>
                  <p className="text-xs text-gray-500">
                    {selectedAddressData.district}/{selectedAddressData.city}
                  </p>
                </div>
              )}

              {/* Place Order Button */}
              <Button
                onClick={handlePlaceOrder}
                disabled={placingOrder || (addresses.length > 0 && !selectedAddress)}
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl"
              >
                {placingOrder ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Sipariş Veriliyor...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CreditCard size={18} />
                    Siparişi Onayla
                  </span>
                )}
              </Button>

              <p className="text-xs text-gray-400 text-center mt-3">
                🔒 Güvenli ödeme
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}