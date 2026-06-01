# Beren Yılmaz'ın Mobil Frontend Görevleri

**Deployed Backend:** https://tikmarket-api.onrender.com

---

## 1. Ürün Ekle Ekranı
- **API Endpoint:** `POST /api/products`
- **Açıklama:** TikMarket sistemine yeni giyim, takı ve aksesuar ürünlerinin eklenmesini sağlar.
- **UI Bileşenleri:**
  - Ürün adı input alanı
  - Açıklama textarea (multiline)
  - Fiyat input alanı (keyboardType: "numeric")
  - Stok input alanı (keyboardType: "numeric")
  - Kategori seçici (Giyim / Takı / Aksesuar — buton grubu)
  - Görsel URL input alanı
  - "Ürünü Ekle" butonu (orange, tam genişlik)
  - ActivityIndicator (kayıt sırasında)
- **Kullanıcı Deneyimi:**
  - Sadece admin kullanıcılar erişebilir
  - Başarılı ekleme sonrası Alert ile bildirim
  - Ürün listesi otomatik güncellenir
  - Modal (Bottom Sheet) içinde form gösterilir
- **Teknik Detaylar:**
  - Framework: React Native 0.85.3
  - API: POST /api/products (admin token ile)
  - Modal component, animationType: "slide"

---

## 2. Ürün Güncelle Ekranı
- **API Endpoint:** `PUT /api/products/{productId}`
- **Açıklama:** Mevcut ürünlerin fiyat, açıklama ve kategori gibi bilgilerinin güncellenmesini sağlar.
- **UI Bileşenleri:**
  - Mevcut ürün bilgileriyle dolu form alanları
  - Ürün adı, açıklama, fiyat, stok inputları
  - Kategori seçici (mevcut kategori seçili)
  - Görsel URL inputu
  - "Güncelle" butonu (orange)
  - "İptal" butonu
- **Kullanıcı Deneyimi:**
  - Düzenle butonuna basınca form mevcut bilgilerle açılır
  - Başarılı güncelleme sonrası Alert bildirimi
  - Ürün listesi ve admin dashboard otomatik güncellenir
  - Modal animasyonlu kapanır
- **Teknik Detaylar:**
  - API: PUT /api/products/:productId (admin token ile)
  - editingProduct state ile form pre-fill

---

## 3. Ürün Sil
- **API Endpoint:** `DELETE /api/products/{productId}`
- **Açıklama:** Belirli bir ürünün sistemden kalıcı olarak silinmesini sağlar.
- **UI Bileşenleri:**
  - 🗑️ Sil butonu (her ürün kartında, kırmızı)
  - Alert.alert onay dialogu ("Emin misiniz?")
  - ActivityIndicator (silme sırasında)
- **Kullanıcı Deneyimi:**
  - Sil butonuna basınca onay dialogu açılır
  - "Sil" destructive style, "İptal" cancel style
  - Silme sonrası ürün listesi güncellenir
  - Admin dashboard istatistikleri güncellenir
- **Teknik Detaylar:**
  - API: DELETE /api/products/:productId (admin token ile)
  - res.status 204 kontrolü

---

## 4. Ürün Görüntüle Ekranı
- **API Endpoint:** `GET /api/products/{productId}`
- **Açıklama:** Ürünlerin detaylı bilgilerinin, fiyatlarının ve görsellerinin kullanıcılar tarafından incelenmesini sağlar.
- **UI Bileşenleri:**
  - Tam genişlik ürün görseli
  - ← Geri butonu (absolute, sol üst)
  - Kategori ve stok badge'leri
  - Ürün adı (büyük başlık)
  - Ürün açıklaması
  - Fiyat kartı (orange renk)
  - Kategori ve stok bilgi kartları
  - Adet seçici (− / + butonları)
  - Güven rozetleri (🚚 Hızlı Kargo, 🔒 Güvenli Ödeme, ↩️ Kolay İade)
- **Kullanıcı Deneyimi:**
  - Stok 0 ise "Stokta Yok" overlay gösterilir
  - Fiyatlar Türk Lirası formatında gösterilir
  - ScrollView ile tüm içerik kaydırılabilir
- **Teknik Detaylar:**
  - Route params: { productId }
  - API: GET /api/products/:productId

---

## 5. Sepete Ürün Ekle
- **API Endpoint:** `POST /api/cart/items`
- **Açıklama:** Kullanıcıların beğendikleri ürünleri satın almak üzere kişisel alışveriş sepetlerine eklemelerine olanak tanır.
- **UI Bileşenleri:**
  - Ürün detay ekranında adet seçici (− / + butonları)
  - "🛒 Sepete Ekle — ₺fiyat" butonu (orange)
  - "✓ Sepete Eklendi!" butonu (green, 3 saniye sonra geri döner)
  - ActivityIndicator (ekleme sırasında)
- **Kullanıcı Deneyimi:**
  - Ekleme başarılı olunca buton yeşile döner
  - 3 saniye sonra buton otomatik orange'a döner
  - Max adet stok miktarıyla sınırlı
  - Giriş yapılmamışsa login ekranına yönlendirilir
- **Teknik Detaylar:**
  - API: POST /api/cart/items { productId, quantity }
  - Authorization: Bearer token ile

---

## 6. Sepetten Ürün Sil
- **API Endpoint:** `DELETE /api/cart/items/{itemId}`
- **Açıklama:** Kullanıcının sepetinden çıkarmak istediği ürünlerin temizlenmesini ve sepet tutarının güncellenmesini sağlar.
- **UI Bileşenleri:**
  - 🗑️ Sil butonu (her sepet öğesinin sağında)
  - ActivityIndicator (silme sırasında)
- **Kullanıcı Deneyimi:**
  - Miktar 1'den fazlaysa miktar 1 azaltılır (PUT kullanılır)
  - Miktar 1'e düşünce tamamen silinir (DELETE kullanılır)
  - Toplam tutar anlık güncellenir
  - Silme sırasında tüm sil butonları devre dışı kalır
- **Teknik Detaylar:**
  - API: DELETE /api/cart/items/:itemId
  - calculateTotal fonksiyonu ile anlık toplam hesaplama

---

## 7. Sepeti Güncelle
- **API Endpoint:** `PUT /api/cart/items/{itemId}`
- **Açıklama:** Sepetteki ürünlerin adet miktarının artırılması veya azaltılması işlemlerini gerçekleştirir.
- **UI Bileşenleri:**
  - Sepet ekranındaki 🗑️ butonu (miktar azaltma için)
  - Ürün detay ekranındaki − / + butonları (adet seçimi)
- **Kullanıcı Deneyimi:**
  - Sil butonuna basınca önce PUT ile miktar azaltılır
  - Son ürün olunca DELETE ile tamamen silinir
  - Toplam otomatik güncellenir
- **Teknik Detaylar:**
  - API: PUT /api/cart/items/:itemId { quantity }
  - item.quantity - 1 ile güncelleme

---

## 8. Sepeti Görüntüle Ekranı
- **API Endpoint:** `GET /api/cart`
- **Açıklama:** Kullanıcının sepetine eklediği ürünlerin listesini ve ödenecek toplam tutarı gösterir.
- **UI Bileşenleri:**
  - Sepet başlığı ve ürün sayısı
  - FlatList ile sepet öğeleri (görsel, isim, adet × fiyat, toplam)
  - Sepet özeti kartı (Ara Toplam, Kargo, Toplam)
  - "💳 Siparişi Onayla" butonu
  - Boş sepet durumu (🛒 emoji + mesaj)
- **Kullanıcı Deneyimi:**
  - useFocusEffect ile her odaklanmada sepet yenilenir
  - 500₺ üzeri alışverişte kargo ücretsiz 🎉
  - Toplam manuel hesaplanır (priceAtTime × quantity)
- **Teknik Detaylar:**
  - API: GET /api/cart (token ile)
  - calculateTotal helper fonksiyonu

---

## 9. Giriş Yap Ekranı
- **API Endpoint:** `POST /api/auth/login`
- **Açıklama:** Kayıtlı kullanıcıların e-posta ve şifreleriyle sisteme giriş yaparak güvenli oturum açmalarını sağlar.
- **UI Bileşenleri:**
  - TikMarket logo (Tik turuncu, Market siyah)
  - Email input alanı (keyboardType: "email-address")
  - Şifre input alanı (secureTextEntry: true)
  - "Giriş Yap" butonu (orange, gölgeli)
  - "Hesabınız yok mu? Kayıt Ol" linki
  - ActivityIndicator (giriş sırasında)
- **Kullanıcı Deneyimi:**
  - Yanlış bilgilerde Alert ile hata mesajı
  - Başarılı girişte JWT token AsyncStorage'a kaydedilir
  - onLogin() callback ile isAuthenticated true yapılır
  - KeyboardAvoidingView ve ScrollView kullanımı
- **Teknik Detaylar:**
  - Token key: `tikmarket_token`
  - User key: `tikmarket_user`
  - API: POST /api/auth/login

---

## 10. Kayıt Ol Ekranı
- **API Endpoint:** `POST /api/auth/register`
- **Açıklama:** Yeni kullanıcıların sisteme hesap oluşturarak dahil olmasını sağlar.
- **UI Bileşenleri:**
  - Ad Soyad input alanı
  - Email input alanı (keyboardType: "email-address")
  - Şifre input alanı (secureTextEntry: true)
  - Telefon input alanı (opsiyonel)
  - "Kayıt Ol" butonu (orange)
  - "Zaten hesabınız var mı? Giriş Yap" linki
  - ActivityIndicator (kayıt sırasında)
- **Kullanıcı Deneyimi:**
  - Zorunlu alan kontrolü (Alert ile)
  - Başarılı kayıtta JWT token kaydedilir
  - onLogin() ile otomatik ana sayfaya yönlendirme
  - KeyboardAvoidingView ile klavye sorunu yok
- **Teknik Detaylar:**
  - API: POST /api/auth/register { name, email, password, phone }
  - Storage: AsyncStorage

---

## 11. Adres Ekleme
- **API Endpoint:** `POST /api/users/addresses`
- **Açıklama:** Kullanıcının sipariş teslimatları için yeni adres bilgilerini profiline kaydetmesini sağlar.
- **UI Bileşenleri:**
  - Adres başlığı input (Ev, İş vs.)
  - Ad Soyad input
  - Telefon input
  - Şehir input
  - İlçe input
  - Açık adres input
  - Posta kodu input (opsiyonel)
  - "Kaydet" butonu (orange)
  - "İptal" butonu
- **Kullanıcı Deneyimi:**
  - Profil ekranında "Adres Ekle" butonu ile form açılır
  - Kayıt sonrası adres listesi güncellenir
  - Başarı mesajı Alert ile gösterilir
- **Teknik Detaylar:**
  - API: POST /api/users/addresses (token ile)
  - useState ile form yönetimi

---

## 12. Adres Silme
- **API Endpoint:** `DELETE /api/users/addresses/{addressId}`
- **Açıklama:** Kullanıcının artık kullanmadığı kayıtlı adreslerini sistemden kaldırmasına imkan tanır.
- **UI Bileşenleri:**
  - Her adres kartında 🗑️ silme butonu
  - Alert.alert onay dialogu
  - ActivityIndicator (silme sırasında)
- **Kullanıcı Deneyimi:**
  - Sil butonuna basınca onay istenir
  - Silme sonrası adres listesi güncellenir
- **Teknik Detaylar:**
  - API: DELETE /api/users/addresses/:addressId (token ile)

---

## 13. Admin Paneli Ekranı
- **API Endpoint:** `GET /api/admin/dashboard`
- **Açıklama:** Sadece yöneticilerin erişebildiği, satış verilerinin ve genel sistem durumunun izlendiği yönetim merkezidir.
- **UI Bileşenleri:**
  - **Dashboard Sekmesi:**
    - 4 istatistik kartı (gradient renkli):
      - 🟠 Kayıtlı Kullanıcı (orange gradient)
      - 🔵 Toplam Ürün (blue gradient)
      - 🟢 Aktif Sepet (green gradient)
      - 🟣 Tahmini Gelir (purple gradient)
    - Kategori dağılımı (Giyim/Takı/Aksesuar adet)
    - Sistem durumu (✅ API, ✅ MongoDB Atlas, TikMarket v1.0.0)
  - **Ürün Yönetimi Sekmesi:**
    - Ürün listesi (isim, kategori, fiyat, stok)
    - ✏️ Düzenle butonu (mavi)
    - 🗑️ Sil butonu (kırmızı, Alert confirm ile)
    - "+ Yeni Ürün Ekle" butonu (orange)
    - Bottom Sheet Modal (ürün ekle/düzenle formu)
- **Kullanıcı Deneyimi:**
  - Sadece role: "admin" kullanıcılar erişebilir
  - Profil ekranındaki "👑 Admin Paneli" butonuyla açılır
  - Sekmeler arası geçiş (Dashboard / Ürün Yönetimi)
  - İşlem sonrası veriler otomatik güncellenir
- **Teknik Detaylar:**
  - API: GET /api/admin/dashboard (admin token ile)
  - API: POST/PUT/DELETE /api/products (CRUD işlemleri)
  - Modal animationType: "slide"
  - navigation.goBack() ile geri dönüş

---

**Geliştirici:** Beren Yılmaz
**Framework:** React Native 0.85.3
**Okul:** Süleyman Demirel Üniversitesi - Bilgisayar Mühendisliği