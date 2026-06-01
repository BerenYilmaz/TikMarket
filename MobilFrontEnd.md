# Mobil Frontend Görev Dağılımı

**Mobil Uygulama:** TikMarket — React Native 0.85.3
**Backend:** https://tikmarket-api.onrender.com

---

## Grup Üyelerinin Mobil Frontend Görevleri

1. [Beren Yılmaz'ın Mobil Frontend Görevleri](Beren-Yilmaz/Beren-Yilmaz-Mobil-Frontend-Gorevleri.md)

---

## Genel Mobil Frontend Prensipleri

### 1. Tasarım Sistemi
- **Renk Paleti:**
  - Primary: `#f97316` (Orange 500) — butonlar, ikonlar, vurgular
  - Dark Header: `#111827` (Gray 900) — navbar, banner arka planı
  - Background: `#f8f8f8` — sayfa arka planı
  - Success: `#16a34a` (Green) — stok var, başarılı işlem
  - Error: `#ef4444` (Red) — hata mesajları, sil butonu
  - Text Primary: `#111827`, Text Secondary: `#6b7280`
- **Tipografi:**
  - Başlıklar: fontWeight "900" (Black)
  - Alt başlıklar: fontWeight "700" (Bold)
  - Gövde metni: fontWeight "600" (SemiBold)
  - Açıklama: fontWeight "400" (Regular)
- **Spacing:** 8px grid sistemi (padding: 8, 12, 16, 20, 24)
- **Border Radius:** borderRadius 10, 12, 14, 16, 20 (yuvarlatılmış köşeler)
- **Icons:** Emoji tabanlı ikonlar (🛒 🏠 👤 👑 📦 🗑️ ✏️ 🚚 🔒)

### 2. Responsive Tasarım
- Farklı Android ekran boyutlarına uyum (Pixel 6, Samsung vs.)
- Portrait mod öncelikli tasarım
- Safe area desteği (paddingTop: 50 ile status bar boşluğu)
- flex: 1 ile tam ekran kullanımı
- FlatList numColumns=2 ile grid layout

### 3. Kullanıcı Deneyimi (UX)
- **Loading States:** ActivityIndicator (color: #f97316) tüm async işlemlerde
- **Error Handling:** Alert.alert ile kullanıcı dostu Türkçe hata mesajları
- **Empty States:** Emoji + başlık + açıklama (🛒 Sepetiniz boş, 📦 Ürün bulunamadı)
- **Feedback:**
  - Sepete ekleme: buton orange → green animasyonu
  - Silme: ActivityIndicator spinner
  - Form kaydetme: Alert.alert başarı mesajı
- **Pull-to-Refresh:** RefreshControl (tintColor: #f97316) ile liste yenileme

### 4. Erişilebilirlik (Accessibility)
- TouchableOpacity ile tüm tıklanabilir alanlar
- disabled prop ile işlem sırasında buton devre dışı
- Minimum touch target: padding: 8 ile yeterli boyut
- Türkçe placeholder ve label metinleri
- Alert.alert ile ekran okuyucu uyumlu bildirimler

### 5. Performans
- useFocusEffect + useCallback ile optimize veri çekme
- FlatList ile büyük listeler için virtualizedlist
- keyExtractor ile liste performansı
- useState lazy initialization
- Image resizeMode: "cover" ile optimize görsel

### 6. Navigasyon
- **Bottom Tab Navigator:** Ana Sayfa (🏠) / Sepet (🛒) / Profil (👤)
- **Stack Navigator:** Login → Register / Main → ProductDetail → Admin
- useFocusEffect ile ekran odaklanma eventleri
- navigation.goBack() ile geri navigasyon
- onLogin() / onLogout() callback pattern ile auth state yönetimi

### 7. Form Yönetimi
- useState ile her input için ayrı state
- Zorunlu alan kontrolü (Alert.alert ile bildirim)
- keyboardType: "email-address" / "numeric" / "phone-pad"
- secureTextEntry: true şifre alanları için
- KeyboardAvoidingView + ScrollView klavye sorunlarını çözer
- loading state ile double-submit koruması

### 8. Platform Özellikleri
- **Android:** Material benzeri shadow (elevation değerleri)
- **Emülatör:** Pixel 6 AVD, API 34 (Android 14)
- Platform.OS === 'ios' ? 'padding' : 'height' (KeyboardAvoidingView)
- StatusBar: barStyle "dark-content", backgroundColor "#ffffff"
- AsyncStorage ile kalıcı veri saklama

### 9. State Management
- **Auth State:** App.tsx'te isAuthenticated (useState)
- **Form State:** Her ekranda lokal useState
- **Loading State:** Her async işlem için ayrı loading state
- **AsyncStorage:** tikmarket_token, tikmarket_user kalıcı saklanır
- Callback pattern: onLogin(), onLogout() prop drilling

### 10. API Entegrasyonu
- **HTTP Client:** fetch API (native)
- **Base URL:** https://tikmarket-api.onrender.com
- **Auth Header:** Authorization: Bearer {token}
- **Error Handling:** try/catch + Alert.alert
- **Token Storage:** AsyncStorage ile kalıcı token
- **Services:** src/services/api.js — tüm API fonksiyonları

---

**Geliştirici:** Beren Yılmaz
**Framework:** React Native 0.85.3
**Okul:** Süleyman Demirel Üniversitesi - Bilgisayar Mühendisliği