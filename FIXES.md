# RVIOS — تقرير التحليل وخطة الإصلاح

> نتيجة تحليل كامل للمونوريبو بتاريخ 2026-08-08.
> تم التحقق من كل بند أدناه عملياً: قراءة المصدر، `tsc --noEmit` على التطبيقات الأربعة،
> بناء `rvios-site` بالكامل، وتشغيل الموقع المبني مقابل API وهمي لرصد الطلبات الفعلية.

## حالة التحقق

| الفحص | النتيجة |
|---|---|
| `tsc --noEmit` — rvios-api | ✅ نجح |
| `tsc --noEmit` — rvios-site | ✅ نجح |
| `tsc --noEmit` — rvios-dashboard | ✅ نجح |
| `tsc --noEmit` — rvios-owner | ✅ نجح |
| `next build` — rvios-site | ✅ نجح (16 مساراً) |
| `pnpm lint` | ❌ مكسور — لا ESLint مثبت، و`next lint` أُزيل في Next 16 |
| الاختبارات | ❌ لا توجد أي اختبارات |
| CI | ❌ لا يوجد |

---

# 🔴 المستوى 1 — أمني حرج (فوري)

## 1.1 أسرار حقيقية مرفوعة على GitHub

**الموقع:** `rvios-api/.env` — متتبَّع في git وموجود في `origin/main`
(`github.com/eng-rayash/rvios-api`). لا يوجد `.gitignore` داخل `rvios-api` إطلاقاً.

**المكشوف:** `CF_ACCESS_KEY_ID`، `CF_SECRET_ACCESS_KEY` (مفاتيح Cloudflare R2 فعّالة)،
`JWT_SECRET`، `JWT_REFRESH_SECRET`، `DATABASE_URL`، `SEED_ADMIN_PASSWORD`.
كذلك `.env.local` متتبَّع في مستودعَي `rvios-dashboard` و`rvios-owner`.

**الإصلاح:**
1. **تدوير كل المفاتيح فوراً** — الحذف من git لا يكفي، القيم باقية في تاريخ المستودع.
   - مفاتيح R2: أنشئ زوجاً جديداً من لوحة Cloudflare واحذف القديم.
   - `JWT_SECRET` و`JWT_REFRESH_SECRET`: قيم عشوائية جديدة (سيُسجَّل خروج كل المستخدمين — مقبول).
   - كلمة مرور قاعدة البيانات وكلمة مرور حساب الأدمن.
2. أنشئ `rvios-api/.gitignore` يتضمن `.env` و`.env.local` و`node_modules/` و`dist/`.
3. `git rm --cached .env` ثم commit.
4. اختياري: تنظيف التاريخ بـ `git filter-repo` — يتطلب force-push وتنسيقاً مع أي متعاون.

## 1.2 CORS يقبل أي مصدر

**الموقع:** `rvios-api/src/main.ts:40-52`

الفرعان `if` و`else` كلاهما ينفّذ `callback(null, true)`، فقائمة `allowedOrigins`
المبنية أعلاه كود ميت. مع `credentials: true` يعني أن أي موقع على الإنترنت
يستطيع استدعاء الـ API بجلسة المستخدم.

**الإصلاح:**
```ts
app.enableCors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```
واحذف شرط `origin.endsWith('.vercel.app')` — يسمح لأي نشر Vercel لأي شخص.

## 1.3 Rate limiting معطّل تماماً

**الموقع:** `rvios-api/src/app.module.ts:28`

`ThrottlerModule.forRoot([...])` مسجَّل لكن لا يوجد `APP_GUARD` ولا `ThrottlerGuard`
في أي مكان بالمشروع. الإعدادات بلا أي أثر. النتيجة: `POST /api/auth/login`
و`POST /api/contacts/submit` مفتوحان للتخمين والسبام بلا حدود.

**الإصلاح** — في `app.module.ts`:
```ts
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [ /* ... */ ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
```
ثم حدّ أشدّ على تسجيل الدخول: `@Throttle({ short: { ttl: 60000, limit: 5 } })`.

## 1.4 دور EDITOR يعادل ADMIN عملياً

`RolesGuard` مستخدم في وحدة واحدة فقط (`UsersController`). كل باقي المسارات
الإدارية — posts, services, projects, categories, media, **settings**, owner, contacts —
محمية بـ `AuthGuard('jwt')` فقط. أي `EDITOR` يستطيع تعديل إعدادات الموقع وحذف كل المحتوى.

**الإصلاح:** أضف `@UseGuards(AuthGuard('jwt'), RolesGuard)` + `@Roles(UserRole.ADMIN)`
على `SettingsController` و`MediaController` و`OwnerController` كحد أدنى.
اترك posts/services/projects متاحة لـ EDITOR إن كان ذلك مقصوداً — لكن اجعله قراراً صريحاً.

## 1.5 التوكنات في كوكيز يقرأها JavaScript

**الموقع:** `rvios-dashboard/lib/auth-context.tsx:39-41`

`js-cookie` بدون `httpOnly` ولا `secure` ولا `sameSite`. الـ refresh token يبقى
7 أيام في كوكي يقرأه أي سكربت. أي XSS = سيطرة كاملة على الحساب.

**الإصلاح (متدرّج):**
- سريع: أضف `{ secure: true, sameSite: 'strict' }` لكل `Cookies.set`، وأبقِ الـ access
  token في ذاكرة React فقط (لا كوكي).
- صحيح: انقل الـ refresh token إلى كوكي `httpOnly` يضبطه الـ API عبر `Set-Cookie`
  (`cookie-parser` مثبّت بالفعل ولا يُستعمل).

## 1.6 نقاط أمنية أصغر

| البند | الموقع | الإصلاح |
|---|---|---|
| `presign` يتجاوز فلتر أنواع الملفات | `media.controller.ts:45` | حوّل `body` إلى DTO بـ `class-validator` و`@IsIn(ALLOWED_MIME)` |
| `bulkUpdate` بلا تحقق | `settings.controller.ts:12` | نفس الشيء — DTO حقيقي بدل نوع inline |
| `image/svg+xml` مسموح | `media.controller.ts:11` | احذفه، أو عقّمه، أو قدّمه من نطاق منفصل |
| `JWT_SECRET \|\| 'fallback-secret'` | `config/configuration.ts:7` | اجعله يرمي خطأ عند الإقلاع بدل العمل بصمت بسر معروف |
| لا حد أعلى لـ `limit` | `posts/dto/post.dto.ts:47` | `@Max(100)` |
| لا `helmet` ولا CSP | `main.ts` | `app.use(helmet())` |

---

# 🔴 المستوى 2 — أخطاء وظيفية مؤكدة (عاجل)

## 2.1 تجديد الجلسة مكسور بنيوياً

`auth.service.ts:77` يخزّن **هاش bcrypt** للتوكن:
```ts
const hashedRefresh = await bcrypt.hash(refreshToken, 10);
await this.prisma.refreshToken.create({ data: { token: hashedRefresh, ... } });
```
بينما `auth.service.ts:34` يبحث عن **التوكن الخام**:
```ts
findUnique({ where: { token: refreshToken } })
```

هاش bcrypt لا يساوي النص الخام أبداً، وbcrypt غير قابل للبحث أصلاً (salt عشوائي).
**النتيجة:** `/api/auth/refresh` يرمي 403 دائماً، و`/api/auth/logout` لا يحذف شيئاً
(سجلات `refresh_tokens` تتراكم للأبد).

**الإصلاح:** استخدم SHA-256 (حتمي وقابل للبحث):
```ts
import { createHash } from 'crypto';
const hash = (t: string) => createHash('sha256').update(t).digest('hex');

// عند الإنشاء
await this.prisma.refreshToken.create({ data: { token: hash(refreshToken), ... } });

// عند التجديد والخروج
findUnique({ where: { token: hash(refreshToken) } })
deleteMany({ where: { token: hash(refreshToken) } })
```
أضف أيضاً مهمة دورية لحذف التوكنات المنتهية.

## 2.2 جلسة لوحة التحكم تموت بعد 15 دقيقة

`refreshTokens` مستوردة في `auth-context.tsx:4` لكن **لا تُستدعى في أي مكان**.
لا يوجد تجديد تلقائي ولا تعامل مع استجابة 401 في `apiFetch`.
النتيجة العملية: بعد انتهاء الـ access token يرى المستخدم أخطاء فقط.

**الإصلاح:** في `apiFetch`، عند 401 → استدعِ `refreshTokens` → أعد المحاولة مرة واحدة →
إن فشل نفّذ `signOut()`. (يعتمد على إصلاح 2.1 أولاً.)

## 2.3 مدونة الموقع معطوبة في الإنتاج

`rvios-site` على Next.js 16 حيث `params` و`searchParams` أصبحا `Promise`،
والكود يقرأهما بشكل متزامن.

**تحقق عملي** — بناء الموقع وتشغيله مقابل API وهمي أعطى:
```
REQ /api/posts/public/undefined          ← من /blog/some-real-slug
REQ /api/posts/public?page=1&limit=9     ← من /blog?page=2&category=cloud
```

- `app/blog/[slug]/page.tsx:71` — `params.slug` = `undefined` → **كل صفحات المقالات ترجع 404**
- `app/blog/page.tsx:20-22` — الترقيم والتصنيف والبحث **تُتجاهل كلها بصمت**
- دليل إضافي: البناء يُعلِّم `/blog` كـ static رغم قراءته `searchParams`

**الإصلاح:**
```ts
// app/blog/page.tsx
export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; search?: string }>;
}) {
  const { page: pageParam, category, search } = await searchParams;
  const page = Number(pageParam) || 1;
  // ...
}

// app/blog/[slug]/page.tsx — في كل من generateMetadata و default export
interface Props { params: Promise<{ slug: string }> }
const { slug } = await params;
```

## 2.4 `pnpm lint` مكسور

لا يوجد أي ملف إعداد ESLint في المشروع، ولا ESLint مثبّت في أي حزمة.
و`rvios-site` يستدعي `next lint` الذي أُزيل في Next 16:
```
Invalid project directory provided, no such directory: F:\rvios\rvios-site\lint
```

**الإصلاح:** ثبّت `eslint` + `eslint-config-next` (للواجهات) و`@typescript-eslint`
(للـ API)، أضف `eslint.config.mjs` (flat config)، وبدّل سكربت site إلى `eslint .`.

## 2.5 إعدادات الموقع لا تصل للموقع

`rvios-site/lib/api/client.ts:63` — `getSiteSettings()` يستدعي `GET /settings`
الذي يتطلب JWT → 401 دائماً → `catch` يرجع `{}`. والدالة نفسها غير مستدعاة من أي مكان.
رقم الواتساب مكتوب يدوياً في `components/ContactForm.tsx` بينما `site_whatsapp`
موجود في جدول الإعدادات ولوحة التحكم تحرّره بلا أي أثر.

**الإصلاح:** أضف مساراً عاماً `GET /api/settings/public` يرجّع مفاتيح مسموحاً بها فقط
(`site_name`, `site_email`, `site_whatsapp`)، واستهلكه في `Footer` و`ContactForm`.

## 2.6 نموذج التواصل لا "يرسل"

`ContactForm.tsx` — `handleWhatsApp` يفتح `wa.me` ويحفظ في القاعدة بـ `.catch(() => {})`
(فشل صامت)، و`handleEmail` يفتح `mailto:` **ولا يحفظ في القاعدة إطلاقاً**.
صندوق الرسائل في لوحة التحكم سيفوّت جزءاً من الطلبات.

**الإصلاح:** `await submitContact(...)` في كلا المسارين مع عرض خطأ عند الفشل.

---

# 🟠 المستوى 3 — مشاكل هيكلية

## 3.1 خمسة مستودعات git بدل واحد

الجذر `F:\rvios` **ليس مستودع git**، وكل تطبيق مستودع مستقل بـ remote منفصل.
النتيجة: `packages/types`، `docker-compose.yml`، `turbo.json`، `pnpm-lock.yaml`،
`README.md`، `STARTUP.md` — كلها خارج أي نظام إصدارات. لا يمكن عمل commit ذرّي
يمسّ الـ API والواجهة معاً، ولا CI على مستوى المشروع.

**الإصلاح:** وحّد في مستودع واحد بالجذر (يمكن استيراد تاريخ كل تطبيق بـ `git subtree add`
للحفاظ على السجل)، أو — إن كان الفصل مقصوداً للنشر — وثّق ذلك صراحةً وأضف على الأقل
مستودعاً للجذر يغطي الملفات المشتركة.

## 3.2 لوحة التحكم منفصلة عن الموقع

الـ API يوفّر `/services/public` و`/projects/public`، ولوحة التحكم تحرّرهما — لكن
`rvios-site` يستهلك **المدونة ونموذج التواصل فقط**. الخدمات مكتوبة يدوياً في
`app/services/page.tsx:13` وفي ست صفحات ثابتة، والمشاريع غير معروضة أصلاً.
تعديل خدمة في لوحة التحكم لا يغيّر شيئاً في الموقع.

كذلك `app/services/software-solutions/page.tsx` موجودة ولا يشير إليها أي رابط
ولا `sitemap.ts` — مسار يتيم.

## 3.3 تعارض إصدارات

- ثلاثة إصدارات Next: **16.2.12** (site) مقابل **14.2.35** (dashboard, owner)
- `rvios-site` يعلن Next 16 مع **React 18.3.1** — Next 16 مصمَّم لـ React 19
- `rvios-site/package-lock.json` موجود داخل workspace يعمل بـ pnpm → احذفه

## 3.4 ازدواج

- الخطوط (6 ملفات) والصور (4 ملفات) **مكرّرة بالكامل** بين `rvios-site/public`
  و`rvios-owner/public` → انقلها إلى حزمة أصول مشتركة
- `rvios-site/app/rayash/page.tsx` وتطبيق `rvios-owner` كامل يخدمان نفس الغرض
- `apiFetch` مكرر بمنطق مختلف قليلاً بين dashboard و site

## 3.5 `@rvios/types` حزمة ميتة

معلَنة في `package.json` و`tsconfig paths` و`transpilePackages` لـ dashboard و owner،
و**لا تُستورد في أي ملف**. 292 سطراً من الأنواع غير مستخدمة، بينما الكود الفعلي
يستعمل `any` في كل مكان (`apiFetch<any>`, `post: any`, `data: any[]`).

**الإصلاح:** إما استخدمها فعلاً (تبدأ من `apiFetch<Post[]>` بدل `any`) أو احذفها
مع مراجعها الثلاثة.

---

# 🟡 المستوى 4 — جودة وكود ميت

## 4.1 كود ميت في rvios-site (~1,750 سطراً)

تم التحقق بالبحث عن الاستيرادات — لا شيء يشير إلى هذه الملفات:

| الملف | الأسطر |
|---|---|
| `lib/blog/posts.ts` | 1,293 |
| `lib/blog/types.ts` | 74 |
| `components/blog/ContentRenderer.tsx` | 176 |
| `components/blog/ArticleCard.tsx` | 136 |
| `components/blog/FAQSection.tsx` | 65 |
| `components/blog/TableOfContents.tsx` | 64 |
| `components/ImageSlot.tsx` | — |

`lib/blog/posts.ts` مقالات مكتوبة يدوياً استُبدلت بالـ API.

## 4.2 ملاحظات أخرى

- `app/blog/[slug]/page.tsx:133` — `dangerouslySetInnerHTML` مع محوّل Markdown يدوي
  بـ regex. المحتوى إداري، لكن دور EDITOR يستطيع حقن HTML → استخدم مكتبة تحويل + تعقيم
- `posts.service.ts:111` — `update` يستدعي `findOne` مرتين، ولا يفحص تفرّد الـ slug
  عند التعديل → خطأ Prisma خام 500 بدل 409
- لوحة التحكم كلها inline styles بلا نظام تصميم، بينما الموقع يستخدم Tailwind
- لا اختبارات، لا CI (`.github/workflows` غير موجود)، لا Dockerfile للنشر
- تعارض توثيق: `STARTUP.md` يقول كلمة المرور `RVIOSAdmin2025@` بينما `.env.example`
  يقول `RVIOS@Admin2025`

---

# ترتيب التنفيذ المقترح

**اليوم:** 1.1 (تدوير المفاتيح) → 1.2 (CORS) → 1.3 (Throttler) → 1.4 (الأدوار)

**هذا الأسبوع:** 2.1 + 2.2 (المصادقة) → 2.3 (المدونة) → 1.5 (الكوكيز) → 1.6

**التالي:** 2.4 (lint) → 2.5 + 2.6 (الإعدادات والتواصل) → 3.1 (توحيد git) →
3.3 (توحيد Next) → 4.1 (حذف الكود الميت)

**لاحقاً:** 3.2 (ربط الخدمات بالـ API) → 3.4 + 3.5 (الازدواج والأنواع) →
CI أساسي (type-check + build) → اختبارات لمسار المصادقة

---

# سجل التنفيذ

## ✅ منجَز — المستوى 1 (أمني)

| البند | الحالة | التحقّق |
|---|---|---|
| 1.2 CORS يقبل أي مصدر | ✅ | `evil.example` لا يحصل على ترويسة ACAO |
| 1.3 Rate limiting معطّل | ✅ | المحاولة السادسة لتسجيل الدخول ترجع 429 |
| 1.4 EDITOR = ADMIN | ✅ | EDITOR يأخذ 403 على settings/users؛ الحذف للمدير وحده |
| 1.6 presign يتجاوز الفلتر | ✅ | `text/html` و`image/svg+xml` يرجعان 400 |
| 1.6 `JWT_SECRET` احتياطي | ✅ | الإقلاع يفشل بخطأ واضح إن غاب السر |
| 1.6 لا helmet، لا حدّ للترقيم | ✅ | `?limit=99999` → 400 |

**متبقٍّ على المستخدم:** تدوير مفاتيح R2 وأسرار JWT (بند 1.1) — لا يمكن تنفيذه من هنا.

## ✅ منجَز — البنية التحتية

- `/api/v1` + `enableVersioning` — 34 مساراً موثّقاً على `/api/docs`
- `AllExceptionsFilter` — P2002 → 409، P2025 → 404، مع الحفاظ على الحقول الإضافية
- `TenantMiddleware` + `AsyncLocalStorage` + امتداد Prisma — عزل تلقائي لأي نموذج
  يحمل `companyId`، مُكتشَف من DMMF لا من قائمة يدوية
- `PaginationQueryDto` مشترك بحدّ أعلى 100
- migrations حقيقية بدل `db push` — بُوشِرت بـ `migrate diff` + `resolve` بلا إعادة تهيئة

## ✅ منجَز — نظام التصميم

- `packages/design-tokens` — مصدر واحد → CSS + Tailwind preset + TS + **Dart**
  (28 لوناً، 12 مسافة، 6 حواف، 9 أحجام نص). الوضع الداكن مصمَّم لا مُرقَّع.
- `packages/brand-assets` — الخطوط في مكان واحد، تُنسخ إلى التطبيقات الثلاثة
- لوحة التحكم: Tailwind + التوكنز + خط الهوية (كان Inter غير محمَّل أصلاً)
- بدائيات UI: `Button` `Card` `Badge` `Table` + `ListPageShell`
- جسر Strangler: أسماء المتغيّرات القديمة أُعيد تعريفها فوق التوكنز، فانتقلت
  الصفحات غير المهاجَرة إلى الهوية الجديدة بلا لمس ملف واحد منها

## ✅ منجَز — معرض الأعمال (الطبقة الخلفية)

- 5 نماذج جديدة: `Project` موسَّع + `ProjectImage` + `ProjectMetric` +
  `ProjectCategory` + `ProjectService`
- 13 مساراً: شبكة بفلترة وترقيم، `filters` بتجميعات حقيقية، `slugs` للـ sitemap،
  صفحة تفصيلية مع related و prev/next، وإدارة كاملة مع بوّابة نشر
- المسودّات مُقصاة في طبقة الخدمة لا المتحكّم

**التالي:** صفحتا `/work` و`/work/[slug]` في الموقع، وشاشة إدارة المعرض في اللوحة.
