# Mobil Backend (REST API Bağlantısı) Görev Dağılımı

**REST API Adresi:** https://tikmarket-api.onrender.com

---

## Grup Üyelerinin Mobil Backend Görevleri

1. [Beren Yılmaz'ın Mobil Backend Görevleri](Beren-Yilmaz/Beren-Yilmaz-Mobil-Backend-Gorevleri.md)

---

## Genel Mobil Backend Prensipleri

### 1. HTTP Client Yapılandırması
- **HTTP Client:** fetch API (React Native native)
- **Base URL:** `https://tikmarket-api.onrender.com`
- **Timeout:** 30 saniye (fetch AbortController ile)
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}` (korumalı endpoint'lerde)
- **API Dosyası:** `src/services/api.js` — tüm endpoint fonksiyonları burada

### 2. Authentication Yönetimi
- JWT token `@react-native-async-storage/async-storage` ile saklanır
- Token key: `tikmarket_token`
- User key: `tikmarket_user`
- Uygulama açılışında AsyncStorage'dan token okunur (App.tsx checkAuth)
- Logout'ta `AsyncStorage.removeItem` ile token ve user temizlenir
- 401 durumunda kullanıcı login ekranına yönlendirilir
- `getHeaders()` fonksiyonu ile her istekte token otomatik eklenir

### 3. Error Handling
- Her API çağrısı try/catch bloğu ile sarılır
- Network hatalarında `Alert.alert('Hata', 'Bağlantı hatası')` gösterilir
- Server hata mesajları (`data.message`) kullanıcıya iletilir
- loading state ile işlem sırasında buton disabled yapılır
- Başarısız işlemlerde UI önceki state'e döner

### 4. Redis Cache Stratejisi
- **Ürün listesi** (`GET /api/products`) → 300 saniye Redis cache
- **Ürün detay** (`GET /api/products/:id`) → Redis cache
- **Admin dashboard** (`GET /api/admin/dashboard`) → kısa süreli cache
- Cache invalidation: Ürün ekle/güncelle/sil işlemlerinde otomatik temizlenir
- `src/config/redis.js` → getCache(), setCache(), deleteCache() fonksiyonları
- Redis bağlantısı Docker'da `tikmarket-redis` container'ında çalışır

### 5. RabbitMQ Mesaj Kuyruğu
- **Kuyruklar:**
  - `cart_events` → Sepete ekleme, güncelleme, silme olayları
  - `order_notifications` → Sipariş bildirimleri, yeni kullanıcı kaydı
- **Publisher:** `publishMessage(queue, message)` ile mesaj gönderme
- **Consumer:** `consumeMessages(queue, callback)` ile mesaj okuma
- `src/config/rabbitmq.js` → bağlantı ve kuyruk yönetimi
- RabbitMQ yönetim paneli: http://localhost:15672 (admin/admin123)
- Docker'da `tikmarket-rabbitmq` container'ında çalışır

### 6. Docker Servisleri
```
docker-compose up -d
```
Ayağa kalkan servisler:
- `tikmarket-mongodb` → MongoDB veritabanı (port 27017)
- `tikmarket-redis` → Redis cache (port 6379)
- `tikmarket-rabbitmq` → Mesaj kuyruğu (port 5672, panel: 15672)
- `tikmarket-backend` → REST API (port 5000)
- `tikmarket-frontend` → Next.js web (port 3000)

### 7. Jenkins CI/CD Pipeline
```
Checkout → Yapı Kontrolü → Bağımlılık Kontrolü → Docker Build → API Health Check → Deploy
```
- GitHub'a her push sonrası pipeline otomatik tetiklenir
- `Jenkinsfile` proje kök dizininde bulunur
- Health check: `curl https://tikmarket-api.onrender.com`
- Başarılı build sonrası backend Render'a, frontend Vercel'e deploy edilir

### 8. Loading States
- Her API çağrısı öncesi `setLoading(true)` / sonrası `setLoading(false)`
- ActivityIndicator (color: '#f97316') ile loading göstergesi
- `disabled={loading}` ile çift gönderim koruması
- useFocusEffect ile ekran odaklanmasında otomatik veri yenileme
- RefreshControl ile pull-to-refresh desteği

### 9. Logging ve Debugging
- Development modunda `console.log` ile API response loglama
- React Native DevTools Console sekmesinden log takibi
- `adb reverse tcp:8081 tcp:8081` ile emülatör-Metro bağlantısı
- Network istekleri DevTools Network sekmesinden izlenebilir

### 10. Güvenlik
- Token Bearer header ile her istekte doğrulama
- Admin endpoint'leri `adminOnly` middleware ile korunur
- `protect` middleware ile JWT doğrulama
- CORS: `origin: "*"` (production'da Vercel URL ile sınırlandırılmalı)
- `.env` dosyası `.gitignore`'da — hassas bilgiler GitHub'a gönderilmez

---

**Geliştirici:** Beren Yılmaz
**Framework:** React Native 0.85.3
**Backend:** Node.js + Express + MongoDB + Redis + RabbitMQ
**DevOps:** Docker + Jenkins CI/CD