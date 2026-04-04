# Beren Yılmaz'ın REST API Metotları

**Deployed API:** `https://tikmarket-api.onrender.com`

**API Test Videosu:** [Video Linki](https://www.youtube.com/watch?v=E5nQHRra_vE)

---

## 1. Kayıt Ol
- **Endpoint:** `POST /api/auth/register`
- **Request Body:**
  ```json
  {
    "name": "Beren Yılmaz",
    "email": "beren@example.com",
    "password": "beren1234",
    "phone": "05551234567"
  }
  ```
- **Response:** `201 Created` - Kullanıcı başarıyla oluşturuldu ve JWT token döndürüldü

---

## 2. Giriş Yap
- **Endpoint:** `POST /api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "beren@example.com",
    "password": "beren1234"
  }
  ```
- **Response:** `200 OK` - Giriş başarılı, JWT token döndürüldü

---

## 3. Ürün Ekle
- **Endpoint:** `POST /api/products`
- **Authentication:** Bearer Token gerekli
- **Request Body:**
  ```json
  {
    "name": "Oversize Sweatshirt",
    "description": "Rahat kesim unisex sweatshirt, %100 pamuk",
    "price": 299.99,
    "category": "giyim",
    "stock": 25,
    "images": ["https://example.com/sweatshirt.jpg"]
  }
  ```
- **Response:** `201 Created` - Ürün başarıyla eklendi

---

## 4. Ürün Güncelle
- **Endpoint:** `PUT /api/products/{productId}`
- **Path Parameters:**
  - `productId` (string, required) - Ürün ID'si
- **Authentication:** Bearer Token gerekli
- **Request Body:**
  ```json
  {
    "price": 249.99,
    "stock": 40,
    "description": "Güncellenmiş ürün açıklaması"
  }
  ```
- **Response:** `200 OK` - Ürün başarıyla güncellendi

---

## 5. Ürün Sil
- **Endpoint:** `DELETE /api/products/{productId}`
- **Path Parameters:**
  - `productId` (string, required) - Ürün ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `204 No Content` - Ürün başarıyla silindi

---

## 6. Ürün Görüntüle
- **Endpoint:** `GET /api/products/{productId}`
- **Path Parameters:**
  - `productId` (string, required) - Ürün ID'si
- **Authentication:** Gerekli değil (Public)
- **Response:** `200 OK` - Ürün detayları ve görselleri başarıyla getirildi

---

## 7. Sepete Ürün Ekle
- **Endpoint:** `POST /api/cart/items`
- **Authentication:** Bearer Token gerekli
- **Request Body:**
  ```json
  {
    "productId": "64f1a2b3c4d5e6f7a8b9c0d2",
    "quantity": 2
  }
  ```
- **Response:** `200 OK` - Ürün sepete başarıyla eklendi

---

## 8. Sepetten Ürün Sil
- **Endpoint:** `DELETE /api/cart/items/{itemId}`
- **Path Parameters:**
  - `itemId` (string, required) - Sepet öğesi ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Ürün sepetten kaldırıldı ve toplam güncellendi

---

## 9. Sepet Ürün Adedini Güncelle
- **Endpoint:** `PUT /api/cart/items/{itemId}`
- **Path Parameters:**
  - `itemId` (string, required) - Sepet öğesi ID'si
- **Authentication:** Bearer Token gerekli
- **Request Body:**
  ```json
  {
    "quantity": 5
  }
  ```
- **Response:** `200 OK` - Sepet öğesi başarıyla güncellendi

---

## 10. Sepeti Görüntüle
- **Endpoint:** `GET /api/cart`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Sepetteki ürünler ve toplam tutar başarıyla getirildi

---

## 11. Teslimat Adresi Ekle
- **Endpoint:** `POST /api/users/addresses`
- **Authentication:** Bearer Token gerekli
- **Request Body:**
  ```json
  {
    "title": "Ev",
    "fullName": "Beren Yılmaz",
    "phone": "05551234567",
    "city": "Antalya",
    "district": "Muratpaşa",
    "addressLine": "Atatürk Cad. No:5 D:3",
    "postalCode": "07100"
  }
  ```
- **Response:** `201 Created` - Adres başarıyla eklendi

---

## 12. Kayıtlı Adresi Sil
- **Endpoint:** `DELETE /api/users/addresses/{addressId}`
- **Path Parameters:**
  - `addressId` (string, required) - Adres ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Adres başarıyla silindi

---

## 13. Admin Dashboard
- **Endpoint:** `GET /api/admin/dashboard`
- **Authentication:** Bearer Token gerekli + Admin yetkisi
- **Response:** `200 OK` - Satış verileri ve sistem durumu başarıyla getirildi
  ```json
  {
    "totalUsers": 24,
    "totalProducts": 87,
    "totalActiveCarts": 12,
    "estimatedRevenue": 15420.50,
    "productsByCategory": [
      { "_id": "giyim", "count": 40 },
      { "_id": "taki", "count": 30 },
      { "_id": "aksesuar", "count": 17 }
    ],
    "systemStatus": {
      "status": "healthy",
      "uptime": 3600.25
    }
  }
  ```