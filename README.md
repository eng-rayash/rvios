# RVIOS — Monorepo

> بنية مشروع RVIOS Technologies الكاملة — Turborepo + pnpm workspaces

## الهيكل

```
F:\rvios\
├── rvios-site/          → الموقع الرئيسي       (port :3000)
├── rvios-dashboard/     → لوحة التحكم          (port :3002)
├── rvios-owner/         → موقع المؤسس          (port :3003)
├── rvios-api/           → Backend API          (port :3001)
├── packages/
│   └── types/           → Shared TypeScript types
├── docker-compose.yml   → PostgreSQL + Redis
├── turbo.json           → Turborepo config
└── pnpm-workspace.yaml  → Workspaces
```

## البدء السريع

### 1 — تشغيل قاعدة البيانات
```bash
pnpm docker:up
```

### 2 — إعداد المتغيرات
```bash
# انسخ .env.example وعدّل القيم
cp .env.example rvios-api/.env
```

### 3 — تهيئة قاعدة البيانات
```bash
pnpm db:push        # تطبيق الـ schema
pnpm db:seed        # إضافة البيانات الأولية
```

### 4 — تشغيل كل التطبيقات
```bash
pnpm dev            # يشغّل الكل بالتوازي
```

أو كل تطبيق منفرداً:
```bash
pnpm dev:api        # API فقط
pnpm dev:site       # الموقع فقط
pnpm dev:dashboard  # لوحة التحكم فقط
pnpm dev:owner      # موقع المؤسس فقط
```

## التطبيقات

| التطبيق | المنفذ | الوصف |
|---------|--------|-------|
| rvios-site | :3000 | الموقع الرئيسي لـ RVIOS |
| rvios-api | :3001 | REST API (NestJS + Prisma) |
| rvios-dashboard | :3002 | لوحة التحكم الإدارية |
| rvios-owner | :3003 | موقع المؤسس الشخصي |

## API Endpoints

```
GET    /api/health                    — فحص الحالة
POST   /api/auth/login                — تسجيل الدخول
POST   /api/auth/refresh              — تجديد التوكن
POST   /api/auth/logout               — تسجيل الخروج
GET    /api/auth/me                   — بيانات المستخدم الحالي

GET    /api/posts/public              — المقالات المنشورة
GET    /api/posts/public/:slug        — مقال بالـ slug
GET    /api/posts                     — (admin) كل المقالات
POST   /api/posts                     — (admin) إنشاء مقال
PUT    /api/posts/:id                 — (admin) تعديل مقال
DELETE /api/posts/:id                 — (admin) حذف مقال

GET    /api/categories                — التصنيفات
GET    /api/services/public           — الخدمات النشطة
GET    /api/projects/public           — المشاريع
POST   /api/contacts/submit           — إرسال رسالة تواصل
GET    /api/owner/profile             — الملف الشخصي للمؤسس

GET    /api/media                     — (admin) الوسائط
POST   /api/media/upload              — (admin) رفع ملف
POST   /api/media/presign             — (admin) رابط رفع مباشر
GET    /api/settings                  — (admin) الإعدادات
GET    /api/users                     — (admin) المستخدمون
```

## الاعتمادات التقنية

- **Monorepo**: pnpm workspaces + Turborepo
- **Backend**: NestJS + Prisma + PostgreSQL
- **Auth**: JWT + Refresh Token Rotation
- **Storage**: Cloudflare R2 (S3-compatible)
- **Frontend**: Next.js 14 App Router
- **Types**: @rvios/types (shared)
