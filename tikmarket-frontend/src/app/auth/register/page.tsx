"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";
import useAuthStore from "@/store/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler eşleşmiyor!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await authService.register(registerData);
      setAuth(response.data, response.token);
      router.push("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Kayıt başarısız. Tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-1 mb-2">
            <span className="text-3xl font-bold text-orange-500">Tik</span>
            <span className="text-3xl font-bold text-gray-800">Market</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-700">Yeni Hesap Oluştur</h1>
          <p className="text-gray-400 text-sm mt-1">Hemen üye ol, alışverişe başla!</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Ad Soyad</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Adınız Soyadınız"
              value={formData.name}
              onChange={handleChange}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">E-posta Adresi</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="ornek@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Telefon Numarası</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="05XX XXX XX XX"
              value={formData.phone}
              onChange={handleChange}
              className="h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Şifre</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="En az 6 karakter"
                value={formData.password}
                onChange={handleChange}
                required
                className="h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Şifrenizi tekrar girin"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="h-11"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Kayıt oluşturuluyor...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus size={18} />
                Kayıt Ol
              </span>
            )}
          </Button>
        </form>

        {/* Login Link */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-sm">veya</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <p className="text-center text-gray-500 text-sm">
          Zaten hesabın var mı?{" "}
          <Link
            href="/auth/login"
            className="text-orange-500 hover:text-orange-600 font-semibold"
          >
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}