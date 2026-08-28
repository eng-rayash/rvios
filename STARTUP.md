# RVIOS — دليل التشغيل

## 1. افتح Docker Desktop أولاً

تأكد أن Docker Desktop يعمل (ابحث عنه في قائمة Start)

---

## 2. تشغيل قاعدة البيانات

```powershell
# في F:\rvios
pnpm docker:up
```

ستظهر:
```
✔ Container rvios_postgres  Started
✔ Container rvios_redis     Started
```

---

## 3. تهيئة قاعدة البيانات

```powershell
# Push schema إلى PostgreSQL
pnpm db:push

# إضافة بيانات تجريبية (admin user + categories + services)
pnpm db:seed
```

بيانات الدخول الافتراضية:
- **Email**: `admin@rvios.com`
- **Password**: `RVIOSAdmin2025@`

---

## 4. تشغيل جميع التطبيقات

```powershell
# تشغيل الكل بالتوازي
pnpm dev
```

أو كل واحد منفرداً:

```powershell
pnpm dev:api        # http://localhost:3001/api
pnpm dev:site       # http://localhost:3000
pnpm dev:dashboard  # http://localhost:3002
pnpm dev:owner      # http://localhost:3003
```

---

## 5. روابط المشروع

| التطبيق | الرابط | الوصف |
|---------|--------|-------|
| الموقع الرئيسي | http://localhost:3000 | rvios-site |
| API | http://localhost:3001/api | rvios-api |
| API Health | http://localhost:3001/api/health | فحص الحالة |
| لوحة التحكم | http://localhost:3002 | rvios-dashboard |
| موقع المؤسس | http://localhost:3003 | rvios-owner |

---

## 6. تكوين Cloudflare R2 (للإنتاج)

عدّل `rvios-api/.env`:
```env
CF_ACCOUNT_ID=your-cloudflare-account-id
CF_ACCESS_KEY_ID=your-r2-access-key
CF_SECRET_ACCESS_KEY=your-r2-secret-key
CF_BUCKET_NAME=rvios-media
CF_PUBLIC_URL=https://pub-xxx.r2.dev
```

---

## 7. بنية المشروع

```
F:\rvios\
├── rvios-site/          # الموقع (Next.js :3000)
│   ├── app/             # صفحات
│   ├── components/      # مكونات
│   └── lib/api/         # client.ts ← API calls
│
├── rvios-dashboard/     # لوحة التحكم (Next.js :3002)
│   ├── app/
│   │   ├── login/       # تسجيل دخول
│   │   └── dashboard/   # المقالات، الخدمات، الرسائل...
│   ├── components/      # Sidebar
│   └── lib/             # api.ts, auth-context.tsx
│
├── rvios-api/           # Backend (NestJS :3001)
│   ├── src/             # Auth, Posts, Services, ...
│   └── prisma/          # schema.prisma, seed.ts
│
├── rvios-owner/         # موقع المؤسس (Next.js :3003)
│   ├── app/             # page.tsx (migrated)
│   └── components/      # rayash/* (Canvas components)
│
├── packages/
│   └── types/           # @rvios/types مشترك
│
└── docker-compose.yml   # PostgreSQL :5432, Redis :6379
```

---

## 8. أوامر مفيدة

```powershell
# فتح Prisma Studio (واجهة قاعدة البيانات)
pnpm db:studio

# إيقاف Docker
pnpm docker:down

# بناء الإنتاج
pnpm build
```
