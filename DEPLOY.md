# RVIOS — دليل النشر الآمن

> هذا الملف هو مصدر الحقيقة لإعدادات النشر. إعدادات لوحات Render وVercel
> يجب أن تطابقه حرفياً — ما يُضبط في لوحة ولا يُوثَّق هنا يضيع عند أول تغيير فريق.

**المستودع:** `github.com/eng-rayash/rvios` — مستودع واحد لكل التطبيقات.
المستودعات الأربعة السابقة (`rvios-api`, `rvios-site`, `rvios-dashboard`,
`rvios-owner`) متروكة ولا يُنشَر منها. اقرأ [SECURITY.md](SECURITY.md) قبل
أي نشر — أسرار الإنتاج كانت مكشوفة وتدويرها شرط مسبق.

---

## 🔴 انحراف قائم في خدمة Render — يجب إصلاحه قبل أي نشر

خدمة `rvios-api` على Render (`srv-d9kfo6rtqb8s73bedjrg`) تعمل حالياً بـ:

```
Repository     github.com/eng-rayash/rvios-api          ← المستودع القديم
Build Command  pnpm install && pnpm build && npx prisma db push && npx ts-node prisma/seed.ts
Start Command  npx prisma db push && yarn start
Pre-Deploy     (غير مضبوط)
```

ثلاث مشاكل، كل واحدة كافية لإفساد الإنتاج:

1. **`prisma db push` في أمر البناء وأمر الإقلاع معاً** — هذا بالضبط ما
   يحظره القسم التالي، وهو سبب فشل نشر 2026-08-10. وفي `Start Command`
   أخطر: يعيد تشكيل مخطط الإنتاج عند **كل** إعادة تشغيل للخدمة.
2. **`npx ts-node prisma/seed.ts` في البناء** — يعيد بذر البيانات في كل نشر.
3. **`yarn start`** بينما المشروع يعمل بـ pnpm.

القيم الصحيحة في جدول [Render — خدمة الـ API](#render--خدمة-الـ-api) أدناه.
لا تبدّل المستودع قبل تطبيق خطوة الباسلاين في «المتطلبات المسبقة».

---

## ⛔ القاعدة الأولى: `prisma db push` ممنوع في أي مسار نشر

`db push` أداة تطوير: تعدّل مخطط قاعدة الإنتاج مباشرة، بلا سجلّ ولا تراجع،
وتحذف أعمدة بلا إنذار. وهي سبب فشل النشر بتاريخ 2026-08-10:

```
⚠️  There might be data loss when applying the changes:
  • A unique constraint covering the columns [slug] on the table projects will be added.
Error: Use the --accept-data-loss flag
==> Build failed
```

السكربت `db:push` **حُذف من جذر المشروع** لهذا السبب. البديل `db:deploy`
(= `prisma migrate deploy`) الذي يطبّق الهجرات المراجَعة فقط.

يبقى `db:push:local-only` داخل `rvios-api` للتطوير المحلي وحده.

---

## المتطلبات المسبقة (مرة واحدة)

### ١. تدوير الأسرار

الأسرار كانت في `.env` متتبَّع في git ومنشور على GitHub وعلى خادم Render
(`Environment variables loaded from .env` في سجلّ البناء). حذفها من الكود
لا يبطلها — **يجب تدويرها من لوحاتها**:

| السر | المكان |
|---|---|
| `CF_ACCESS_KEY_ID` + `CF_SECRET_ACCESS_KEY` | Cloudflare → R2 → API Tokens: أنشئ زوجاً وأبطل القديم |
| `JWT_SECRET` + `JWT_REFRESH_SECRET` | `openssl rand -hex 32` لكل واحد — سيُسجَّل خروج الجميع، وهو مطلوب |
| كلمة مرور Postgres | Render → Postgres → Reset Password |
| `SEED_ADMIN_PASSWORD` | قيمة جديدة ثم `pnpm db:seed` |

ثم اضبطها في **متغيّرات بيئة Render**، لا في ملف.

### ٢. باسلاين قاعدة الإنتاج

قاعدة الإنتاج أُنشئت بـ `db push` فلا تملك جدول `_prisma_migrations`.
قبل أول نشر، من **Render → Shell** على خدمة الـ API:

```bash
pnpm --filter rvios-api exec prisma migrate resolve --applied 0_init
```

هذا يخبر Prisma أن المخطط القديم مطبَّق أصلاً، فيبدأ `migrate deploy`
من `1_portfolio`.

`0_init` مولَّد من مخطط commit `06e2089` — أي **ما على الإنتاج بالضبط**.

### ٣. نسخة احتياطية

`1_portfolio` تعدّل جدول `projects` القائم. الهجرات لا تتراجع تلقائياً.
خذ نسخة من **Render → Postgres → Backups** قبل أول `migrate deploy`.

---

## Render — خدمة الـ API

| الإعداد | القيمة |
|---|---|
| Root Directory | *(فارغ — جذر المستودع)* |
| Build Command | `pnpm install --frozen-lockfile && pnpm --filter rvios-api exec prisma generate && pnpm --filter rvios-api build` |
| **Pre-Deploy Command** | `pnpm --filter rvios-api exec prisma migrate deploy` |
| Start Command | `pnpm --filter rvios-api start` |
| Health Check Path | `/api/v1/health` |
| Node Version | `20` أو أعلى |

**لماذا Pre-Deploy لا Build:** Pre-Deploy يعمل بعد نجاح البناء وقبل تحويل
الحركة إلى النسخة الجديدة. فإن فشلت الهجرة، يتوقّف النشر وتبقى النسخة
العاملة تخدم — بدل أن يُترك مخطط نصف مطبَّق مع كود جديد.

**تأكّد أن حقل Build Command لا يحوي `db push`** — هذا ما كان يفشل.

### متغيّرات بيئة Render

```
DATABASE_URL           (من Render Postgres — Internal URL)
JWT_SECRET             (مُدوَّر)
JWT_REFRESH_SECRET     (مُدوَّر)
JWT_EXPIRES_IN         15m
JWT_REFRESH_EXPIRES_IN 7d
CORS_ORIGINS           https://<site>,https://<dashboard>,https://<owner>
CF_ACCOUNT_ID          (من Cloudflare)
CF_ACCESS_KEY_ID       (مُدوَّر)
CF_SECRET_ACCESS_KEY   (مُدوَّر)
CF_BUCKET_NAME         rvios-media
CF_PUBLIC_URL          https://<r2-public-host>
```

`configuration.ts` يفشل عند الإقلاع إن غاب `DATABASE_URL` أو `JWT_SECRET`
أو `JWT_REFRESH_SECRET` — فشل صريح خير من العمل بسرّ افتراضي معروف.

---

## Vercel — الواجهات الثلاث

مشروع منفصل لكل واجهة، من نفس المستودع:

| الإعداد | rvios-site | rvios-dashboard | rvios-owner |
|---|---|---|---|
| Root Directory | `rvios-site` | `rvios-dashboard` | `rvios-owner` |
| Build Command | `pnpm build` | `pnpm build` | `pnpm build` |
| Install Command | `pnpm install --frozen-lockfile` | ← | ← |

**حرج:** `packages/design-tokens/dist/` **مولَّد وغير متتبَّع في git**.
لذلك كل واجهة تحمل:

```json
"prebuild": "pnpm --filter @rvios/design-tokens run build && node ../packages/brand-assets/sync.mjs"
```

بدونه يفشل البناء بـ:
```
Error: Cannot find module '.../@rvios/design-tokens/dist/preset.cjs'
```
(تحقّقنا من ذلك عملياً بحذف `dist/` والبناء بنسخة نظيفة.)

**لا تستدعِ `next build` مباشرة** في إعدادات Vercel — يتخطّى `prebuild`.

### متغيّرات بيئة Vercel

```
NEXT_PUBLIC_API_URL = https://<render-host>/api/v1
```

يقبل `lib/api` الأصل وحده أو المسار الكامل ويصل دائماً إلى `/api/v1`.

---

## ترتيب النشر

```
١. تدوير الأسرار
      ↓
٢. ضبط متغيّرات Render وVercel
      ↓
٣. نسخة احتياطية من قاعدة الإنتاج
      ↓
٤. باسلاين: migrate resolve --applied 0_init   (مرة واحدة، من Render Shell)
      ↓
٥. نشر الـ API  → Pre-Deploy يطبّق 1_portfolio
      ↓
٦. فحص /api/v1/health و /api/docs
      ↓
٧. نشر الواجهات الثلاث
      ↓
٨. الفحص الشامل أدناه
```

**التراجع:** كل خدمة تعود لنشرها السابق من لوحتها. الهجرة وحدها لا تتراجع
تلقائياً — لذلك النسخة الاحتياطية في الخطوة ٣ ليست اختيارية.

---

## فحص ما بعد النشر

```bash
API=https://<render-host>/api/v1

# صحّة الخدمة
curl -s -o /dev/null -w '%{http_code}\n' $API/health            # 200

# CORS يرفض الغرباء
curl -s -I -H "Origin: https://evil.example" $API/health | grep -ci access-control-allow-origin   # 0

# الحدّ على تسجيل الدخول
for i in $(seq 1 6); do
  curl -s -o /dev/null -w '%{http_code} ' -XPOST $API/auth/login \
    -H 'Content-Type: application/json' -d '{"email":"a@b.co","password":"wrong1"}'
done; echo    # آخرها 429

# المعرض
curl -s $API/projects | head -c 200
curl -s -o /dev/null -w '%{http_code}\n' $API/projects/filters   # 200

# لا أسرار في المستودع
git ls-files | grep -c '\.env$'                                  # 0
```

وفي المتصفح: مقالة مدونة حقيقية تفتح · `/work` يعرض المشاريع ·
لوحة التحكم تسجّل الدخول وتصمد أكثر من ٢٠ دقيقة.

---

## سجلّ الهجرات

| الهجرة | المحتوى |
|---|---|
| `0_init` | مخطط المنصّة الأساسي — ١٠ جداول. يمثّل ما على الإنتاج قبل المعرض. |
| `1_portfolio` | توسيع `Project` + `project_images` + `project_metrics` + `project_categories` + `project_services` + نوعان جديدان. **مكتوبة يدوياً** لحفظ بيانات الإنتاج. |

`1_portfolio` تفعل بالترتيب: تنشئ الأنواع → **تعيد تسمية** `imageUrl`→`coverImageUrl`
و`url`→`liveUrl` (بدل حذفهما) → تضيف الأعمدة nullable → تعبّئ `summary`
و`slug` للصفوف القائمة → تفرض `NOT NULL` والفهرس الفريد → تنشئ الجداول الجديدة.

اختُبرت على قاعدة تحمل صفوفاً بمخطط الإنتاج: الصور والروابط محفوظة، والمخطط
الناتج مطابق لـ `schema.prisma` بصفر انحراف.

**عند أي تغيير مخطط لاحق:** `pnpm db:migrate` محلياً (يولّد هجرة)، راجع الـ SQL
يدوياً إن مسّ بيانات قائمة، ثم ادفع — و`migrate deploy` يطبّقها في النشر.
