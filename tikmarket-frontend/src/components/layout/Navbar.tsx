"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout, loadAuth } = useAuthStore();
  const { itemCount } = useCartStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    loadAuth();
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navLinks = [
    { label: "Tüm Ürünler", category: ""         },
    { label: "Giyim",       category: "giyim"    },
    { label: "Takı",        category: "taki"     },
    { label: "Aksesuar",    category: "aksesuar" },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white shadow-md" : "bg-white border-b border-gray-100"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 items-center h-16">

          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-black text-orange-500 tracking-tight">Tik</span>
              <span className="text-2xl font-black text-gray-900 tracking-tight">Market</span>
            </Link>
          </div>

          {/* Center Nav Links */}
          <div className="hidden md:flex items-center justify-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.category ? `/?category=${link.category}` : "/"}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-all duration-150"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center justify-end gap-2">

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-xl text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-all"
            >
              <ShoppingCart size={20} />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>

            {/* Desktop Auth */}
            {mounted && isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                {user?.role === "admin" && (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-orange-500 bg-orange-50 hover:bg-orange-100 transition-all border border-orange-200"
                  >
                    <LayoutDashboard size={15} />
                    Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all border border-gray-200"
                >
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[10px] font-black">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {user?.name?.split(" ")[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-10 h-10 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : mounted ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all border border-gray-200"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 transition-all shadow-md shadow-orange-200"
                >
                  Kayıt Ol
                </Link>
              </div>
            ) : null}

            {/* Mobile Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.category ? `/?category=${link.category}` : "/"}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-all"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-gray-100 pt-3 mt-3 flex gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200 text-center"
                >
                  Profilim
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 border border-red-200"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200 text-center"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-orange-500 text-center"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}