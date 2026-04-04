# Beren Yılmaz'ın Web Frontend Görevleri

**Front-end Test Videosu:** [Video Linki](https://youtu.be/JW4Td2Csb6U)

**Deployed Frontend:** https://tik-market-fmbxnm54a-berenyilmazs-projects.vercel.app

---

## 1. Kayıt Ol Sayfası
- **API Endpoint:** `POST /api/auth/register`
- **Görev:** Kullanıcı kayıt işlemi için web sayfası tasarımı ve implementasyonu
- **UI Bileşenleri:**
  - Responsive kayıt formu (desktop ve mobile uyumlu)
  - Ad Soyad input alanı
  - Email input alanı (type="email")
  - Şifre input alanı (type="password")
  - Telefon input alanı (opsiyonel)
  - "Kayıt Ol" butonu (orange primary button)
  - "Zaten hesabınız var mı? Giriş Yap" linki
  - Loading spinner (kayıt işlemi sırasında)
  - Form container (centered card layout)
- **Form Validasyonu:**
  - Required field kontrolü
  - Email format kontrolü
  - Minimum şifre uzunluğu kontrolü (6 karakter)
  - Client-side ve server-side validation
- **Kullanıcı Deneyimi:**
  - Hata mesajları ekranda gösterilir
  - Başarılı kayıt sonrası otomatik ana sayfaya yönlendirme
  - JWT token localStorage'a kaydedilir
  - Double-click koruması (loading state)
- **Teknik Detaylar:**
  - Framework: Next.js 14 (App Router)
  - Stil: Tailwind CSS + shadcn/ui
  - State management: Zustand (authStore)
  - HTTP Client: Axios
  - Routing: Next.js router.push()

---

## 2. Giriş Yap Sayfası
- **API Endpoint:** `POST /api/auth/login`
- **Görev:** Kullanıcı giriş işlemi için web sayfası tasarımı ve implementasyonu
- **UI Bileşenleri:**
  - Responsive giriş formu
  - Email input alanı
  - Şifre input alanı
  - "Giriş Yap" butonu (orange primary button)
  - "Hesabınız yok mu? Kayıt Ol" linki
  - Loading spinner (giriş işlemi sırasında)
- **Kullanıcı Deneyimi:**
  - Yanlış bilgi girişinde hata mesajı
  - Başarılı girişte ana sayfaya yönlendirme
  - JWT token localStorage'a (`tikmarket_token`) kaydedilir
  - Kullanıcı bilgileri Zustand store'a kaydedilir
- **Teknik Detaylar:**
  - Framework: Next.js 14 (App Router)
  - Stil: Tailwind CSS + shadcn/ui
  - State management: Zustand (authStore)
  - Token storage: localStorage

---

## 3. Ana Sayfa - Ürün Listeleme
- **API Endpoint:** `GET /api/products`
- **Görev:** Tüm ürünlerin listelendiği ana sayfa tasarımı ve implementasyonu
- **UI Bileşenleri:**
  - Hero banner (gradient dark background, başlık, arama çubuğu)
  - Kategori filtreleme butonları (Tümü, Giyim, Takı, Aksesuar)
  - Ürün grid'i (2-6 kolonlu responsive grid)
  - ProductCard bileşeni (görsel, isim, açıklama, fiyat, stok durumu)
  - Skeleton loading animasyonu
  - Boş durum mesajı
  - Arama sonucu özeti
- **Filtreleme & Arama:**
  - Kategori bazlı filtreleme (URL query param: `?category=giyim`)
  - Metin bazlı arama (ürün adına göre)
  - Arama temizleme butonu
- **Kullanıcı Deneyimi:**
  - Sayfa yüklenirken skeleton animasyonu
  - Kategori değişiminde anlık filtreleme
  - Sticky kategori navbar (scroll'da sabit kalır)
  - Ürün kartına hover'da "Sepete Ekle" butonu görünür
  - Ürün görseline tıklandığında detay sayfasına gidilir
- **Teknik Detaylar:**
  - Framework: Next.js 14 (App Router)
  - Stil: Tailwind CSS
  - Suspense boundary (useSearchParams için)
  - useCallback ile optimize fetch
  - productService.getAll() ile API çağrısı

---

## 4. Ürün Detay Sayfası
- **API Endpoint:** `GET /api/products/:productId`
- **Görev:** Tek ürünün detaylı görüntülendiği sayfa tasarımı ve implementasyonu
- **UI Bileşenleri:**
  - Geri dön butonu
  - Büyük ürün görseli (hover'da zoom efekti)
  - Thumbnail görseller (birden fazla görsel varsa)
  - Kalp ikonu (istek listesi - UI only)
  - Kategori ve stok durumu badge'leri
  - Ürün adı (H1)
  - Yıldız değerlendirme göstergesi
  - Fiyat kartı (büyük, orange renk)
  - Kategori ve stok bilgi kartları
  - Adet seçici (+/- butonları)
  - "Sepete Ekle" butonu (orange → green animasyon)
  - Satıcı bilgisi
  - Güven rozetleri (Hızlı Kargo, Güvenli Ödeme, Kolay İade)
- **Kullanıcı Deneyimi:**
  - Skeleton loading animasyonu
  - Stok yoksa ürün görseli üzerine "Stokta Yok" overlay'i
  - Sepete eklendiğinde buton yeşile döner ve "Eklendi ✓" gösterir
  - Giriş yapılmamışsa sepete ekle login sayfasına yönlendirir
  - Max adet stok miktarıyla sınırlıdır
- **Teknik Detaylar:**
  - Framework: Next.js 14 (Dynamic Route: `/products/[id]`)
  - cartService.addItem() ile API çağrısı
  - useCartStore ile sepet state güncelleme

---

## 5. Sepet Sayfası
- **API Endpoint:** `GET /api/cart`, `PUT /api/cart/items/:itemId`, `DELETE /api/cart/items/:itemId`
- **Görev:** Kullanıcının sepetini görüntüleyip yönetebileceği sayfa tasarımı
- **UI Bileşenleri:**
  - Sepet başlığı ve ürün sayısı
  - Sepet öğeleri listesi (görsel, isim, fiyat, adet kontrolü)
  - Adet artırma/azaltma butonları
  - Ürün silme butonu
  - Sepet özeti kartı (ara toplam, kargo, toplam)
  - "Ödemeye Geç" butonu
  - "Alışverişe Devam Et" linki
  - Boş sepet durumu (görsel + mesaj)
- **Kullanıcı Deneyimi:**
  - Adet değişiminde toplam anlık güncellenir
  - Ürün silindiğinde animasyonlu kaldırma
  - Loading state her işlem için ayrı
  - Giriş yapılmamışsa login sayfasına yönlendirir
- **Teknik Detaylar:**
  - Framework: Next.js 14
  - cartService ile tüm API çağrıları
  - useCartStore (Zustand) ile global sepet state

---

## 6. Kullanıcı Profil Sayfası
- **API Endpoint:** `GET /api/users/profile`, `POST /api/users/addresses`, `DELETE /api/users/addresses/:addressId`
- **Görev:** Kullanıcı profil bilgileri ve adres yönetimi sayfası
- **UI Bileşenleri:**
  - Dark gradient header banner
  - Kullanıcı avatar (ismin baş harfi, frosted glass efekti)
  - Kullanıcı adı ve email
  - Admin rozeti (admin kullanıcılar için)
  - Hızlı erişim menüsü (Ürünleri Gez, Sepetim, Admin Panel, Çıkış Yap)
  - Hesap bilgileri kartı (ad soyad, email)
  - Teslimat adresleri listesi
  - Yeni adres ekleme formu (toggle)
  - Adres silme butonu
- **Form Alanları (Adres):**
  - Adres başlığı (Ev, İş vs.)
  - Ad Soyad
  - Telefon
  - Şehir
  - İlçe
  - Açık adres
  - Posta kodu
- **Kullanıcı Deneyimi:**
  - Auth kontrolü (giriş yapılmamışsa login'e yönlendir)
  - 200ms timeout ile auth check (redirect loop önleme)
  - Adres eklendiğinde liste anlık güncellenir
  - Başarı/hata mesajları
  - Loading spinner auth kontrol sırasında
- **Teknik Detaylar:**
  - Framework: Next.js 14
  - userService ile API çağrıları
  - loadAuth() ile token kontrolü
  - Zustand authStore

---

## 7. Admin Paneli - Dashboard
- **API Endpoint:** `GET /api/admin/dashboard`
- **Görev:** Admin kullanıcılar için yönetim paneli ana sayfası
- **UI Bileşenleri:**
  - Header (geri butonu, başlık, yenile butonu)
  - Dashboard / Ürün Yönetimi sekme butonları
  - 4 istatistik kartı:
    - Kayıtlı Kullanıcı (orange gradient)
    - Toplam Ürün (blue gradient)
    - Aktif Sepet (emerald gradient)
    - Tahmini Gelir (violet gradient)
  - Kategori dağılımı grafiği (progress bar)
  - Sistem durumu kartı (API, Uptime, Veritabanı, Platform)
- **Kullanıcı Deneyimi:**
  - Admin yetkisi yoksa ana sayfaya yönlendirir
  - Yenile butonu ile anlık veri güncelleme
  - Hover'da kart yükselme animasyonu
  - API aktif göstergesi (yeşil pulse animasyonu)
- **Teknik Detaylar:**
  - Framework: Next.js 14
  - adminService.getDashboard() ile API çağrısı
  - Admin middleware kontrolü

---

## 8. Admin Paneli - Ürün Yönetimi
- **API Endpoint:** `GET /api/products`, `POST /api/products`, `PUT /api/products/:productId`, `DELETE /api/products/:productId`
- **Görev:** Admin kullanıcılar için ürün ekleme, düzenleme ve silme sayfası
- **UI Bileşenleri:**
  - Ürün tablosu (görsel, isim, kategori, fiyat, stok, işlemler)
  - "Yeni Ürün Ekle" butonu
  - Düzenle butonu (her satırda)
  - Sil butonu (her satırda, onay dialog'u ile)
  - Modal form (ekleme/düzenleme için):
    - Ürün adı
    - Açıklama (textarea)
    - Fiyat + Stok (yan yana)
    - Kategori (select: Giyim, Takı, Aksesuar)
    - Görsel URL + önizleme
    - Kaydet / İptal butonları
- **Kullanıcı Deneyimi:**
  - Düzenle'ye tıklandığında form mevcut bilgilerle dolar
  - Sil'e tıklandığında browser confirm dialog açılır
  - İşlem sonrası tablo ve dashboard anlık güncellenir
  - Görsel URL girildiğinde küçük önizleme gösterilir
  - Stok 0 ise kırmızı, 1-5 ise sarı, 5+ ise yeşil gösterilir
- **Teknik Detaylar:**
  - Framework: Next.js 14
  - productService (create, update, delete) ile API çağrıları
  - Modal state yönetimi (useState)
  - Admin + auth middleware kontrolü