import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-1 mb-4">
              <span className="text-2xl font-bold text-orange-500">Tik</span>
              <span className="text-2xl font-bold text-white">Market</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Giyim, takı ve aksesuar kategorilerinde en kaliteli ürünleri
              uygun fiyatlarla sunuyoruz.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kategoriler</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/?category=giyim" className="hover:text-orange-400 transition-colors">Giyim</Link></li>
              <li><Link href="/?category=taki" className="hover:text-orange-400 transition-colors">Takı</Link></li>
              <li><Link href="/?category=aksesuar" className="hover:text-orange-400 transition-colors">Aksesuar</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hesabım</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/auth/login" className="hover:text-orange-400 transition-colors">Giriş Yap</Link></li>
              <li><Link href="/auth/register" className="hover:text-orange-400 transition-colors">Kayıt Ol</Link></li>
              <li><Link href="/profile" className="hover:text-orange-400 transition-colors">Profilim</Link></li>
              <li><Link href="/cart" className="hover:text-orange-400 transition-colors">Sepetim</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-sm text-gray-500">
            © 2026 TikMarket. Tüm hakları saklıdır.
          </p>
          <p className="text-sm text-gray-500">
            Developed by <span className="text-orange-400 font-medium">Beren</span>
          </p>
        </div>
      </div>
    </footer>
  );
}