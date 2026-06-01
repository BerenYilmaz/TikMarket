# Beren Yılmaz'ın Mobil Backend Görevleri

**Backend URL:** https://tikmarket-api.onrender.com

---

## 1. Kayıt Ol Servisi
- **API Endpoint:** `POST /api/auth/register`
- **Görev:** Mobil uygulamada kullanıcı kayıt işlemini gerçekleştiren servis entegrasyonu
- **İşlevler:**
  - Kullanıcı bilgilerini (name, email, password, phone) toplama
  - Form validasyonu (zorunlu alan kontrolü, min 6 karakter şifre)
  - fetch API ile POST isteği gönderme
  - Başarılı kayıtta JWT token ve kullanıcı bilgisi AsyncStorage'a kaydetme
  - onLogin() callback ile ana sayfaya yönlendirme
  - Hata durumlarını Alert.alert ile kullanıcıya gösterme
- **RabbitMQ Entegrasyonu:**
  - Yeni kullanıcı kaydında `order_notifications` kuyruğuna hoş geldin mesajı yayınlanır
- **Teknik Detaylar:**
  - HTTP Client: fetch API
  - Storage: @react-native-async-storage/async-storage
  - Token key: `tikmarket_token`
  - User key: `tikmarket_user`
  - Error handling: Alert.alert ile kullanıcı dostu mesajlar

---

## 2. Giriş Yap Servisi
- **API Endpoint:** `POST /api/auth/login`
- **Görev:** Kayıtlı kullanıcıların mobil uygulamaya giriş yapmasını sağlayan servis
- **İşlevler:**
  - Email ve şifre bilgilerini toplama
  - fetch API ile POST isteği gönderme
  - JWT token ve kullanıcı bilgisini AsyncStorage'a kaydetme
  - role: "admin" kontrolü ile admin paneline erişim sağlama
  - Hatalı girişte Alert.alert ile bildirim
- **Redis Entegrasyonu:**
  - Başarılı giriş sonrası kullanıcı session bilgisi Redis'te cache'lenir
  - Token doğrulama işlemlerinde Redis cache kullanılır
- **Teknik Detaylar:**
  - Authorization: Bearer token sistemi
  - AsyncStorage ile kalıcı oturum
  - onLogin() callback ile state güncelleme

---

## 3. Ürün Listeleme Servisi
- **API Endpoint:** `GET /api/products`
- **Görev:** Ürünleri API'den çekip mobil ana ekranda gösterme
- **İşlevler:**
  - Kategori ve arama parametreleriyle ürün filtreleme
  - useFocusEffect ile her ekran odaklanmasında veri yenileme
  - Pull-to-refresh (RefreshControl) ile manuel yenileme
  - FlatList ile 2 kolonlu grid görünümü
  - Stok ve fiyat bilgilerini formatlı gösterme
- **Redis Entegrasyonu:**
  - Ürün listesi Redis'te 300 saniye (5 dakika) cache'lenir
  - Cache varsa API'ye istek atmadan hızlı sonuç döner
  - Ürün ekle/güncelle/sil işlemlerinde cache otomatik temizlenir
- **Teknik Detaylar:**
  - Query params: ?category=giyim&search=tisort
  - Public endpoint (token gerekmez)
  - Intl.NumberFormat ile Türk Lirası formatı

---

## 4. Ürün Detay Servisi
- **API Endpoint:** `GET /api/products/{productId}`
- **Görev:** Tek ürünün detaylı bilgilerini API'den çekip gösterme
- **İşlevler:**
  - productId ile ürün detayını getirme
  - Görsel, fiyat, stok, kategori bilgilerini gösterme
  - Adet seçici ile sepete ekleme
  - Stok 0 ise sepete ekleme butonunu gizleme
- **Redis Entegrasyonu:**
  - Ürün detay bilgisi Redis'te cache'lenir
  - Tekrar ziyarette cache'den hızlı yüklenir
- **Teknik Detaylar:**
  - Route params: { productId }
  - Public endpoint (token gerekmez)

---

## 5. Ürün Ekle Servisi (Admin)
- **API Endpoint:** `POST /api/products`
- **Görev:** Admin kullanıcıların yeni ürün eklemesini sağlayan servis
- **İşlevler:**
  - name, description, price, category, stock, images bilgilerini toplama
  - Admin token ile POST isteği gönderme
  - Başarılı ekleme sonrası ürün listesini güncelleme
  - Dashboard istatistiklerini yenileme
- **RabbitMQ Entegrasyonu:**
  - Yeni ürün eklendiğinde `cart_events` kuyruğuna bildirim gönderilir
- **Redis Entegrasyonu:**
  - Ürün ekleme sonrası Redis cache temizlenir
  - Güncel ürün listesi yeniden cache'lenir
- **Teknik Detaylar:**
  - Authorization: Bearer admin token
  - Modal form ile veri toplama
  - animationType: "slide"

---

## 6. Ürün Güncelle Servisi (Admin)
- **API Endpoint:** `PUT /api/products/{productId}`
- **Görev:** Mevcut ürünlerin bilgilerini güncelleme servisi
- **İşlevler:**
  - Mevcut ürün bilgilerini form'a pre-fill etme
  - Değiştirilen alanları API'ye gönderme
  - Başarılı güncelleme sonrası liste yenileme
  - Alert.alert ile başarı bildirimi
- **Redis Entegrasyonu:**
  - Güncelleme sonrası ilgili ürünün Redis cache'i temizlenir
- **Teknik Detaylar:**
  - Authorization: Bearer admin token
  - editingProduct state ile form yönetimi

---

## 7. Ürün Sil Servisi (Admin)
- **API Endpoint:** `DELETE /api/products/{productId}`
- **Görev:** Ürünü sistemden kalıcı olarak silme servisi
- **İşlevler:**
  - Alert.alert ile silme onayı alma
  - DELETE isteği gönderme
  - res.status 204 kontrolü
  - Silme sonrası ürün listesini güncelleme
- **Redis Entegrasyonu:**
  - Silme sonrası Redis cache temizlenir
- **Teknik Detaylar:**
  - Authorization: Bearer admin token
  - Destructive action pattern

---

## 8. Sepete Ürün Ekle Servisi
- **API Endpoint:** `POST /api/cart/items`
- **Görev:** Ürünleri kullanıcının sepetine ekleme servisi
- **İşlevler:**
  - productId ve quantity ile POST isteği gönderme
  - Başarılı ekleme sonrası buton animasyonu (orange → green)
  - 3 saniye sonra buton tekrar orange'a döner
  - Token yoksa login ekranına yönlendirme
- **RabbitMQ Entegrasyonu:**
  - Sepete ürün eklendiğinde `cart_events` kuyruğuna mesaj gönderilir
  - Bu mesaj stok takibi ve bildirim sistemi için kullanılır
- **Teknik Detaylar:**
  - Authorization: Bearer token zorunlu
  - Body: { productId, quantity }

---

## 9. Sepetten Ürün Sil / Güncelle Servisi
- **API Endpoint:** `DELETE /api/cart/items/{itemId}` / `PUT /api/cart/items/{itemId}`
- **Görev:** Sepet yönetimi — ürün silme ve miktar güncelleme
- **İşlevler:**
  - Miktar > 1 ise PUT ile miktar azaltma
  - Miktar = 1 ise DELETE ile tamamen silme
  - Toplam tutarı anlık güncelleme (calculateTotal)
  - Silme sırasında tüm butonlar disabled
- **RabbitMQ Entegrasyonu:**
  - Sepet güncelleme işlemlerinde `cart_events` kuyruğuna mesaj gönderilir
- **Teknik Detaylar:**
  - Authorization: Bearer token zorunlu
  - PUT body: { quantity: item.quantity - 1 }

---

## 10. Sepeti Görüntüle Servisi
- **API Endpoint:** `GET /api/cart`
- **Görev:** Kullanıcının sepetini API'den çekip gösterme
- **İşlevler:**
  - useFocusEffect ile her odaklanmada sepet yenileme
  - Ürün listesi, adet ve fiyat bilgilerini gösterme
  - Toplam tutarı manuel hesaplama (priceAtTime × quantity)
  - 500₺ üzeri ücretsiz kargo kontrolü
- **Teknik Detaylar:**
  - Authorization: Bearer token zorunlu
  - calculateTotal helper fonksiyonu

---

## 11. Adres Ekle Servisi
- **API Endpoint:** `POST /api/users/addresses`
- **Görev:** Kullanıcının profil sayfasından yeni teslimat adresi eklemesi
- **İşlevler:**
  - title, fullName, phone, city, district, addressLine, postalCode bilgilerini toplama
  - POST isteği gönderme
  - Başarılı ekleme sonrası adres listesini güncelleme
  - Alert.alert ile başarı bildirimi
- **Teknik Detaylar:**
  - Authorization: Bearer token zorunlu
  - useState ile form state yönetimi

---

## 12. Adres Sil Servisi
- **API Endpoint:** `DELETE /api/users/addresses/{addressId}`
- **Görev:** Kullanıcının kayıtlı adresini silme servisi
- **İşlevler:**
  - Alert.alert ile silme onayı alma
  - DELETE isteği gönderme
  - Silme sonrası adres listesini güncelleme
- **Teknik Detaylar:**
  - Authorization: Bearer token zorunlu

---

## 13. Admin Dashboard Servisi
- **API Endpoint:** `GET /api/admin/dashboard`
- **Görev:** Admin kullanıcı için sistem istatistiklerini getirme servisi
- **İşlevler:**
  - totalUsers, totalProducts, totalActiveCarts, estimatedRevenue bilgilerini getirme
  - Kategori dağılımı (productsByCategory) gösterme
  - Sistem durumu (API, MongoDB, uptime) gösterme
  - Sadece admin token ile erişim

- **Redis Entegrasyonu:**
  - Dashboard verileri Redis'te kısa süre cache'lenir
  - Yenile butonuyla cache temizlenip güncel veri çekilir

- **RabbitMQ Entegrasyonu:**
  - `cart_events` kuyruğundan gelen mesajlar dashboard istatistiklerini günceller
  - `order_notifications` kuyruğu sipariş bildirimlerini yönetir

- **Jenkins CI/CD Entegrasyonu:**
  - GitHub'a her push sonrası Jenkins pipeline otomatik tetiklenir
  - Checkout → Bağımlılık Kontrolü → Docker Build → Health Check aşamaları çalışır
  - Backend https://tikmarket-api.onrender.com adresine deploy edilir
  - Frontend https://tik-market-fmbxnm54a-berenyilmazs-projects.vercel.app adresine deploy edilir

- **Docker Entegrasyonu:**
  - docker-compose.yml ile tüm servisler tek komutla ayağa kalkar:
    - tikmarket-mongodb (MongoDB)
    - tikmarket-redis (Cache)
    - tikmarket-rabbitmq (Mesaj kuyruğu)
    - tikmarket-backend (REST API)
    - tikmarket-frontend (Next.js)
    
- **Teknik Detaylar:**
  - Authorization: Bearer admin token zorunlu
  - Profil ekranındaki "👑 Admin Paneli" butonu ile açılır

---

**Geliştirici:** Beren Yılmaz
**Okul:** Süleyman Demirel Üniversitesi - Bilgisayar Mühendisliği
**Teknolojiler:** React Native + Node.js + MongoDB + Redis + RabbitMQ + Docker + Jenkins