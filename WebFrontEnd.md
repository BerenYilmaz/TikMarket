# Web Frontend Görev Dağılımı

**Web Frontend Adresi:** [Web Link Adresi](https://tik-market-fmbxnm54a-berenyilmazs-projects.vercel.app)

Bu dokümanda, TikMarket web uygulamasının kullanıcı arayüzü (UI) ve kullanıcı deneyimi (UX) görevleri listelenmektedir. Tüm frontend Beren Yılmaz tarafından tasarlanmış ve implement edilmiştir.

---

## Web Frontend Görevleri

1. [Beren Yılmaz'ın Web Frontend Görevleri](Beren-Yilmaz/Beren-Yilmaz-Web-Frontend-Gorevleri.md)

---

## Kullanılan Teknolojiler

- **Framework:** Next.js 14 (App Router)
- **Dil:** TypeScript
- **Stil:** Tailwind CSS
- **UI Kütüphanesi:** shadcn/ui
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Deployment:** Vercel

---

## Genel Web Frontend Prensipleri

### 1. Responsive Tasarım
- **Mobile-First Approach:** Önce mobil tasarım, sonra desktop
- **Breakpoints:**
  - Mobile: < 768px (grid-cols-2)
  - Tablet: 768px - 1024px (grid-cols-3/4)
  - Desktop: > 1024px (grid-cols-5/6)
- **Flexible Layouts:** Tailwind CSS Grid ve Flexbox kullanımı
- **Touch-Friendly:** Minimum touch target boyutları

### 2. Tasarım Sistemi
- **CSS Framework:** Tailwind CSS
- **Renk Paleti:** Orange (#f97316) primary, Gray secondary
- **Tipografi:** System font stack, font-black başlıklar
- **Spacing:** Tailwind spacing sistemi (4px base)
- **Iconography:** Lucide React icon library
- **Component Library:** shadcn/ui + custom components
- **Border Radius:** rounded-xl, rounded-2xl, rounded-3xl

### 3. Performans Optimizasyonu
- **Code Splitting:** Next.js otomatik route-based splitting
- **Lazy Loading:** Next.js Image optimization
- **Suspense:** useSearchParams için Suspense boundary
- **Skeleton Loading:** Tüm sayfalarda loading animasyonları
- **useCallback:** Gereksiz re-render önleme

### 4. SEO
- **Meta Tags:** Next.js metadata API
- **Semantic HTML:** Proper HTML5 semantic elements
- **Alt Text:** Tüm görseller için alt attributes

### 5. Erişilebilirlik
- **Keyboard Navigation:** Tab order desteği
- **Focus Indicators:** Visible focus states
- **ARIA:** Form label ve input ilişkilendirmeleri
- **Color Contrast:** Orange/White yeterli kontrast

### 6. State Management
- **Global State:** Zustand (authStore, cartStore)
- **Auth State:** JWT token localStorage'da saklanır
- **Cart State:** Sepet item count navbar'da gösterilir
- **Local State:** useState ile component-level state
- **Loading States:** Her async işlem için ayrı loading state

### 7. Routing
- **Client-Side Routing:** Next.js App Router
- **Protected Routes:** Auth kontrolü (useEffect + router.push)
- **Dynamic Routes:** /products/[id]
- **404 Handling:** Next.js built-in 404
- **Query Params:** Kategori filtreleme (?category=giyim)

### 8. API Entegrasyonu
- **HTTP Client:** Axios
- **Base URL:** NEXT_PUBLIC_API_URL environment variable
- **Token Injection:** Authorization: Bearer token header
- **Error Handling:** try/catch + kullanıcı dostu mesajlar
- **Loading States:** Her istek için loading göstergesi
- **Services:** authService, productService, cartService, userService, adminService

### 9. Sayfalar
| Sayfa | Route | Açıklama |
|---|---|---|
| Ana Sayfa | `/` | Ürün listeleme, arama, filtreleme |
| Kayıt Ol | `/auth/register` | Kullanıcı kayıt formu |
| Giriş Yap | `/auth/login` | Kullanıcı giriş formu |
| Ürün Detay | `/products/[id]` | Ürün detay ve sepete ekleme |
| Sepet | `/cart` | Sepet yönetimi |
| Ödeme | `/checkout` | Sipariş onaylama |
| Profil | `/profile` | Kullanıcı bilgileri ve adresler |
| Admin Dashboard | `/admin/dashboard` | İstatistikler ve ürün yönetimi |

### 10. Build ve Deployment
- **Build Tool:** Next.js (Turbopack)
- **Environment Variables:** .env.local (NEXT_PUBLIC_API_URL)
- **CI/CD:** Vercel GitHub entegrasyonu (otomatik deploy)
- **Hosting:** Vercel (Free Plan)
- **Domain:** tik-market-fmbxnm54a-berenyilmazs-projects.vercel.app