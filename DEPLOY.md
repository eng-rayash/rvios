# RVIOS — دليل النشر الآمن

> هذا الملف هو مصدر الحقيقة لإعدادات النشر. إعدادات لوحات Render وVercel
> يجب أن تطابقه حرفياً — ما يُضبط في لوحة ولا يُوثَّق هنا يضيع عند أول تغيير فريق.

**المستودع:** `github.com/eng-rayash/rvios` — مستودع واحد لكل التطبيقات.
المستودعات الأربعة السابقة (`rvios-api`, `rvios-site`, `rvios-dashboard`,
`rvios-owner`) متروكة ولا يُنشَر منها. اقرأ [SECURITY.md](SECURITY.md) قبل
أي نشر — أسرار الإنتاج كانت مكشوفة وتدويرها شرط مسبق.

---

## البنية الحالية (2026-08-29)

| الطبقة | أين | ملاحظة |
|---|---|---|
| قاعدة البيانات | Supabase `rvios-platform` — `eu-central-1` | `lnrqrkemkqrcrsbtcsrc` |
| الـ API | Render `rvios-api-eu` — `frankfurt` | `srv-da91rv5g1s2s738uemng` |
| الواجهات الثلاث | Vercel | لم تُنشأ بعد |

**لماذا فرانكفورت للاثنين:** القاعدة والـ API يجب أن يتجاورا — طلب API واحد
قد يُصدر عدة استعلامات، وكل استعلام عابر للمحيط يضاعف زمن الاستجابة. وفرانكفورت
أقرب لمستخدمي الخليج من أوريغون.

**الخدمة القديمة `rvios-api` (`srv-d9kfo6rtqb8s73bedjrg`) في أوريغون متروكة**،
ومعها قاعدة Render المجانية `rvios-db` التي انتهت صلاحيتها في 2026-08-27
(الخطة المجانية تنتهي بعد ٣٠ يوماً، لا تُعلَّق فحسب). بيانات الإنتاج القديمة
لم تُستعد — البداية من `db:seed`.

### Supabase — سلسلتا الاتصال

من Dashboard ← Connect، ولا تستخدم الاتصال المباشر:

| المتغيّر | المصدر | المنفذ |
|---|---|---|
| `DATABASE_URL` | Transaction pooler + `?pgbouncer=true` | 6543 |
| `DIRECT_URL` | Session pooler | 5432 |

`db.<ref>.supabase.co` المباشر يعمل على **IPv6 فقط**، وخوادم Render تخرج بـ IPv4 —
فيفشل الاتصال برسالة غامضة. المجمّعان كلاهما IPv4.

والهجرات تحتاج `DIRECT_URL` لأنها تستخدم عبارات مُعدّة وقفلاً استشارياً لا
يدعمهما مجمّع المعاملات.

**لا تستخدم مفتاح `service_role` من NestJS إطلاقاً** — Prisma يتصل بسلسلة اتصال
عادية ولا يحتاجه. انظر [SECURITY.md](SECURITY.md).

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
| كلمة مرور Postgres | Supabase → Settings → Database → Reset password |
| `SEED_ADMIN_PASSWORD` | قيمة جديدة ثم `pnpm db:seed` |

ثم اضبطها في **متغيّرات بيئة Render**، لا في ملف.

بما أن القاعدة جديدة والأسرار تُكتب من الصفر، ولّد قيماً **جديدة** بدل
المسرَّبة — فيتحقّق التدوير بنفس الخطوة بلا عمل إضافي.

### ٢. لا باسلاين — القاعدة جديدة

على قاعدة Supabase الفارغة يبني `migrate deploy` المخطط كاملاً من `0_init`
فصاعداً. **لا تشغّل `migrate resolve --applied 0_init`** — سيخبر Prisma أن
`0_init` مطبَّق أصلاً فتُتخطّى، ولن تُنشأ الجداول، ويسقط التطبيق عند أول
استعلام.

خطوة الباسلاين كانت تخصّ قاعدة Render القديمة المولَّدة بـ `db push`، وقد
سقطت مع سقوطها.

### ٣. البذر بعد أول هجرة ناجحة

```bash
pnpm db:seed
```

من **Render → Shell**، مرة واحدة. يُنشئ حساب المدير بقيمة `SEED_ADMIN_PASSWORD`
المضبوطة في متغيّرات البيئة.

(`prisma db seed` لا يعمل — لا يوجد بلوك `prisma.seed` في `package.json`.
السكربت المعرَّف هو `db:seed` من الجذر ← `prisma:seed` ← `ts-node prisma/seed.ts`.)

ولتعبئة المعرض: `pnpm --filter rvios-api run prisma:seed-projects`.

---

## Render — خدمة الـ API

| الإعداد | القيمة |
|---|---|
| Root Directory | *(فارغ — جذر المستودع)* |
| Build Command | `pnpm install --frozen-lockfile && pnpm --filter rvios-api exec prisma generate && pnpm --filter rvios-api build` |
| Start Command | `pnpm --filter rvios-api start` |
| Health Check Path | `/api/v1/health` |
| Node Version | `20` أو أعلى |
| **Pre-Deploy Command** | **غير متاح على الخطة المجانية** — انظر أدناه |

**تأكّد أن حقل Build Command لا يحوي `db push`** — هذا ما كان يفشل.

### 🔻 قيد الخطة المجانية: الهجرات تُشغَّل يدوياً

`Pre-Deploy Command` و`Shell` كلاهما ميزة خطط مدفوعة على Render. فعلى
`free` **لا مكان في مسار النشر لتشغيل `migrate deploy`**.

الحلّ المعتمَد: تُشغَّل الهجرات **من جهاز المطوّر** على قاعدة Supabase مباشرة،
قبل دفع الكود الذي يعتمد عليها. قاعدة Supabase متاحة من الإنترنت عبر
المجمّع، فلا حاجة لصدفة على الخادم.

```bash
# في rvios-api/.env: اضبط DATABASE_URL وDIRECT_URL على سلسلتَي Supabase
pnpm db:status     # ما المطبَّق وما المعلّق
pnpm db:deploy     # يطبّق المعلّق
```

**لماذا لا نضع `migrate deploy` في Build Command:** البناء يعمل والنسخة
القديمة ما زالت تخدم. فهجرة مثل `1_portfolio` — التي **تعيد تسمية** أعمدة —
تكسر الكود العامل فوراً، قبل أن تصل النسخة الجديدة. وإن فشل البناء بعدها،
بقي المخطط متقدّماً على الكود بلا تراجع.

الترتيب الصحيح إذاً: **هجرة يدوية أولاً، ثم ادفع الكود.** وإن رقّيت الخدمة
إلى خطة مدفوعة، أعد `Pre-Deploy Command` إلى
`pnpm --filter rvios-api exec prisma migrate deploy` واحذف الخطوة اليدوية —
Pre-Deploy يعمل بعد نجاح البناء وقبل تحويل الحركة، فيجمع الأمرين بأمان.

### متغيّرات بيئة Render

```
DATABASE_URL           (Supabase Transaction pooler :6543 + ?pgbouncer=true)
DIRECT_URL             (Supabase Session pooler :5432)
JWT_SECRET             (مُدوَّر — openssl rand -hex 32)
JWT_REFRESH_SECRET     (مُدوَّر — openssl rand -hex 32)
SEED_ADMIN_EMAIL       (بريد المدير)
SEED_ADMIN_PASSWORD    (مُدوَّرة — القديمة كانت في .env.example العام)
JWT_EXPIRES_IN         15m                    ← مضبوط
JWT_REFRESH_EXPIRES_IN 7d                     ← مضبوط
CF_BUCKET_NAME         rvios-media            ← مضبوط
NODE_VERSION           20                     ← مضبوط
CORS_ORIGINS           https://<site>,https://<dashboard>,https://<owner>
CF_ACCOUNT_ID          (من Cloudflare)
CF_ACCESS_KEY_ID       (مُدوَّر)
CF_SECRET_ACCESS_KEY   (مُدوَّر)
CF_PUBLIC_URL          https://<r2-public-host>
```

الأربعة المؤشَّرة بـ ← مضبوطة على `rvios-api-eu` أصلاً. والباقي يُضبط يدوياً
من اللوحة — قيم الأسرار لا تمرّ عبر أداة ولا تُكتب في ملف.

`CORS_ORIGINS` تُضبط بعد إنشاء مشاريع Vercel ومعرفة نطاقاتها. حتى ذلك الحين
القيمة الافتراضية `http://localhost:3000` فقط، أي أن الواجهات المنشورة ستُرفض.

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
