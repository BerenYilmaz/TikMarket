"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User, MapPin, Plus, Trash2,
  LogOut, Package, ChevronRight,
  ShoppingCart, Shield
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userService } from "@/services/userService";
import useAuthStore from "@/store/authStore";

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

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, loadAuth } = useAuthStore();

  const [checking, setChecking]     = useState(true);
  const [addresses, setAddresses]   = useState<Address[]>([]);
  const [loading, setLoading]       = useState(false);
  const [showForm, setShowForm]     = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");

  const [formData, setFormData] = useState({
    title: "", fullName: "", phone: "",
    city: "", district: "", addressLine: "", postalCode: "",
  });

  useEffect(() => {
  loadAuth();
  const timer = setTimeout(() => {
    setChecking(false);
  }, 200);
  return () => clearTimeout(timer);
}, []);

useEffect(() => {
  if (!checking && isAuthenticated) {
    fetchAddresses();
  }
}, [checking, isAuthenticated]);

const fetchAddresses = async () => {
  try {
    const token = localStorage.getItem("tikmarket_token");
    if (!token) return;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await response.json();
    if (data.success) {
      setAddresses(data.data.addresses || []);
    }
  } catch (err) {
    console.error("Adresler yüklenemedi:", err);
  }
};

  useEffect(() => {
    if (!checking && !isAuthenticated) router.push("/auth/login");
  }, [checking, isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await userService.addAddress(formData);
      setAddresses(response.data);
      setSuccess("Adres başarıyla eklendi!");
      setShowForm(false);
      setFormData({ title: "", fullName: "", phone: "", city: "", district: "", addressLine: "", postalCode: "" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Adres eklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    setRemovingId(addressId);
    try {
      const response = await userService.deleteAddress(addressId);
      setAddresses(response.data);
    } catch (err) {
      console.error("Silme hatası:", err);
    } finally {
      setRemovingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen bg-[#f8f8f8]">

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-orange-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-4xl font-black">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mb-1">{user.name}</h1>
          <p className="text-gray-400 text-sm">{user.email}</p>
          {user.role === "admin" && (
            <div className="inline-flex items-center gap-1.5 mt-3 bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold px-3 py-1.5 rounded-full">
              <Shield size={12} />
              Admin Kullanıcı
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Left Panel */}
          <div className="md:col-span-1 space-y-4">

            {/* Quick Access */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hızlı Erişim</h3>
              </div>
              <div className="p-3 space-y-1.5">
                <button
                  onClick={() => router.push("/")}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-orange-50 transition-all group"
                >
                  <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-200 transition-colors">
                    <Package size={18} className="text-orange-500" />
                  </div>
                  <span className="text-sm font-bold text-gray-700 group-hover:text-orange-500 transition-colors">Ürünleri Gez</span>
                  <ChevronRight size={16} className="text-gray-300 ml-auto group-hover:text-orange-400 transition-colors" />
                </button>

                <button
                  onClick={() => router.push("/cart")}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-blue-50 transition-all group"
                >
                  <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                    <ShoppingCart size={18} className="text-blue-500" />
                  </div>
                  <span className="text-sm font-bold text-gray-700 group-hover:text-blue-500 transition-colors">Sepetim</span>
                  <ChevronRight size={16} className="text-gray-300 ml-auto group-hover:text-blue-400 transition-colors" />
                </button>

                {user.role === "admin" && (
                  <button
                    onClick={() => router.push("/admin/dashboard")}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-orange-50 transition-all group"
                  >
                    <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-200 transition-colors">
                      <Shield size={18} className="text-orange-500" />
                    </div>
                    <span className="text-sm font-bold text-gray-700 group-hover:text-orange-500 transition-colors">Admin Panel</span>
                    <ChevronRight size={16} className="text-gray-300 ml-auto group-hover:text-orange-400 transition-colors" />
                  </button>
                )}
              </div>
              <div className="px-3 pb-3">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-red-50 hover:bg-red-100 transition-all group border border-red-100"
                >
                  <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-red-200 transition-colors">
                    <LogOut size={18} className="text-red-500" />
                  </div>
                  <span className="text-sm font-bold text-red-500">Çıkış Yap</span>
                  <ChevronRight size={16} className="text-red-300 ml-auto" />
                </button>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hesap Bilgileri</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-gray-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 font-medium">Ad Soyad</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-500 text-xs font-bold">@</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 font-medium">E-posta</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Addresses */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-black text-gray-900">Teslimat Adreslerim</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{addresses.length} kayıtlı adres</p>
                </div>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-orange-200 active:scale-95"
                >
                  <Plus size={16} />
                  Yeni Adres
                </button>
              </div>

              {success && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-5 text-sm font-medium">
                  ✓ {success}
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm">
                  {error}
                </div>
              )}

              {showForm && (
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-5 mb-6">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin size={16} className="text-orange-500" />
                    Yeni Adres Ekle
                  </h3>
                  <form onSubmit={handleAddAddress}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="title" className="text-xs font-semibold text-gray-600">Adres Başlığı *</Label>
                        <Input id="title" name="title" placeholder="Ev, İş, Diğer..." value={formData.title} onChange={handleChange} required className="h-10 text-sm rounded-xl" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="fullName" className="text-xs font-semibold text-gray-600">Ad Soyad *</Label>
                        <Input id="fullName" name="fullName" placeholder="Alıcı adı soyadı" value={formData.fullName} onChange={handleChange} required className="h-10 text-sm rounded-xl" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-semibold text-gray-600">Telefon *</Label>
                        <Input id="phone" name="phone" placeholder="05XX XXX XX XX" value={formData.phone} onChange={handleChange} required className="h-10 text-sm rounded-xl" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="city" className="text-xs font-semibold text-gray-600">Şehir *</Label>
                        <Input id="city" name="city" placeholder="İstanbul" value={formData.city} onChange={handleChange} required className="h-10 text-sm rounded-xl" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="district" className="text-xs font-semibold text-gray-600">İlçe *</Label>
                        <Input id="district" name="district" placeholder="Kadıköy" value={formData.district} onChange={handleChange} required className="h-10 text-sm rounded-xl" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="postalCode" className="text-xs font-semibold text-gray-600">Posta Kodu</Label>
                        <Input id="postalCode" name="postalCode" placeholder="34710" value={formData.postalCode} onChange={handleChange} className="h-10 text-sm rounded-xl" />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="addressLine" className="text-xs font-semibold text-gray-600">Açık Adres *</Label>
                        <Input id="addressLine" name="addressLine" placeholder="Mahalle, sokak, bina no, daire..." value={formData.addressLine} onChange={handleChange} required className="h-10 text-sm rounded-xl" />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button type="submit" disabled={loading}
                        className="flex-1 h-10 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50">
                        {loading ? "Kaydediliyor..." : "Adresi Kaydet"}
                      </button>
                      <button type="button" onClick={() => setShowForm(false)}
                        className="px-5 h-10 border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-semibold rounded-xl transition-all">
                        İptal
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {addresses.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin size={28} className="text-gray-300" strokeWidth={1.5} />
                  </div>
                  <p className="text-gray-500 font-semibold mb-1">Henüz adres eklenmedi</p>
                  <p className="text-gray-400 text-sm mb-4">Teslimat adresinizi ekleyin</p>
                  <button onClick={() => setShowForm(true)} className="text-orange-500 text-sm font-bold hover:underline">
                    + İlk adresinizi ekleyin
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div key={address._id}
                      className="flex items-start justify-between p-4 border-2 border-gray-100 rounded-2xl hover:border-orange-200 hover:bg-orange-50/30 transition-all"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                          <MapPin size={18} className="text-orange-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900 text-sm">{address.title}</span>
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{address.city}</span>
                          </div>
                          <p className="text-gray-600 text-sm">{address.fullName} • {address.phone}</p>
                          <p className="text-gray-400 text-xs mt-1 truncate">
                            {address.addressLine}, {address.district}
                            {address.postalCode && ` ${address.postalCode}`}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAddress(address._id)}
                        disabled={removingId === address._id}
                        className="ml-3 w-8 h-8 flex items-center justify-center rounded-xl text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all disabled:opacity-40 flex-shrink-0"
                      >
                        {removingId === address._id ? (
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}