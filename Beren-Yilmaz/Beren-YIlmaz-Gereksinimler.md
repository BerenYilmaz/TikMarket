## 🛠 API Referansı ve Gereksinimler

1. **Ürün Ekle**
   - **API Metodu:** `POST /api/products`
   - **Açıklama:** TikMarket sistemine yeni giyim, takı ve aksesuar ürünlerinin eklenmesini sağlar. Ürün bilgilerinin ve stok verilerinin kaydedilmesini içerir.

2. **Ürün Güncelle**
   - **API Metodu:** `PUT /api/products/{productId}`
   - **Açıklama:** Mevcut ürünlerin fiyat, açıklama ve kategori gibi bilgilerinin güncellenmesini sağlar.

3. **Ürün Sil**
   - **API Metodu:** `DELETE /api/products/{productId}`
   - **Açıklama:** Belirli bir ürünün sistemden kalıcı olarak silinmesini sağlar. Bu işlemden sonra ürün platformda görüntülenemez.

4. **Ürün Görüntüle**
   - **API Metodu:** `GET /api/products/{productId}`
   - **Açıklama:** Ürünlerin detaylı bilgilerinin, fiyatlarının ve görsellerinin kullanıcılar tarafından incelenmesini sağlar.

5. **Sepete Ürün Ekle**
   - **API Metodu:** `POST /api/cart/items`
   - **Açıklama:** Kullanıcıların beğendikleri ürünleri satın almak üzere kişisel alışveriş sepetlerine eklemelerine olanak tanır.

6. **Sepetten Ürün Sil**
   - **API Metodu:** `DELETE /api/cart/items/{itemId}`
   - **Açıklama:** Kullanıcının sepetinden çıkarmak istediği ürünlerin temizlenmesini ve sepet tutarının güncellenmesini sağlar.

7. **Sepeti Güncelle**
   - **API Metodu:** `PUT /api/cart/items/{itemId}`
   - **Açıklama:** Sepetteki ürünlerin adet miktarının artırılması veya azaltılması işlemlerini gerçekleştirir.

8. **Sepeti Görüntüle**
   - **API Metodu:** `GET /api/cart`
   - **Açıklama:** Kullanıcının sepetine eklediği ürünlerin listesini ve ödenecek toplam tutarı gösterir.

9. **Giriş Yap**
   - **API Metodu:** `POST /api/auth/login`
   - **Açıklama:** Kayıtlı kullanıcıların e-posta ve şifreleriyle sisteme giriş yaparak güvenli oturum açmalarını sağlar.

10. **Kayıt Ol**
    - **API Metodu:** `POST /api/auth/register`
    - **Açıklama:** Yeni kullanıcıların sisteme hesap oluşturarak dahil olmasını sağlar. Kişisel kayıt bilgilerinin toplanmasını içerir.

11. **Adres Ekleme**
    - **API Metodu:** `POST /api/users/addresses`
    - **Açıklama:** Kullanıcının sipariş teslimatları için yeni adres bilgilerini profiline kaydetmesini sağlar.

12. **Adres Silme**
    - **API Metodu:** `DELETE /api/users/addresses/{addressId}`
    - **Açıklama:** Kullanıcının artık kullanmadığı kayıtlı adreslerini sistemden kaldırmasına imkan tanır.

13. **Admin Paneli**
    - **API Metodu:** `GET /api/admin/dashboard`
    - **Açıklama:** Sadece yöneticilerin erişebildiği, satış verilerinin ve genel sistem durumunun izlendiği yönetim merkezidir.

---
**Geliştirici:** Beren Yılmaz