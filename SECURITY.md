# الأمن — RVIOS

## خلفية التسريب

المستودعات الأربعة السابقة (`rvios-api`, `rvios-dashboard`, `rvios-owner`,
`rvios-site`) كانت **عامّة على GitHub**، وكان `rvios-api/.env` **متتبَّعاً في
git** ومنشوراً فيها. و`.env.example` كان يحمل بيانات حساب المدير الحقيقية.
و`RVIOS_APP_ANALYSIS.md` كان يقتبس مفتاح Supabase `service_role` حرفياً.

**حذف المستودعات لا يبطل الأسرار.** ما نُشر علناً يبقى في النسخ المخبّأة
والـ forks وأرشيفات GitHub وزواحف الطرف الثالث. الإبطال الوحيد هو التدوير
من لوحة كل خدمة.

## حالة التدوير

| السرّ | الحالة |
|---|---|
| `JWT_SECRET` · `JWT_REFRESH_SECRET` | ✅ مُدوَّران |
| كلمة مرور قاعدة البيانات | ✅ مُدوَّرة (وقاعدة Render القديمة حُذفت أصلاً) |
| `SEED_ADMIN_PASSWORD` | ✅ مُدوَّرة |
| `CF_ACCESS_KEY_ID` · `CF_SECRET_ACCESS_KEY` | ✅ مُدوَّران — تُحقّق برفع فعلي (HTTP 200) |
| مفتاح Supabase `service_role` | ✅ باطل — مشروعه محذوف (انظر أدناه) |

**تنبيه دائم:** نجاح الرفع يثبت أن المفاتيح المضبوطة صالحة، **لا** أنها
الجديدة. المفتاح القديم يعمل أيضاً ما دام لم يُحذف من Cloudflare. الفحص
الحاسم الوحيد: **غياب الرمز القديم من قائمة R2 API Tokens** — لا نجاح
عملية رفع.

---

## مصفوفة الأسرار — من أين، وإلى أين

| المتغيّر | من أين تجلبه | Render | `rvios-api/.env` |
|---|---|:--:|:--:|
| `DATABASE_URL` | Supabase ← Connect ← Transaction pooler `:6543` + `?pgbouncer=true` | ✔ | ✔ |
| `DIRECT_URL` | Supabase ← Connect ← Session pooler `:5432` | ✔ | ✔ |
| `JWT_SECRET` | تولّده أنت (أدناه) | ✔ | ✔ |
| `JWT_REFRESH_SECRET` | تولّده أنت — **قيمة مختلفة** | ✔ | ✔ |
| `SEED_ADMIN_EMAIL` | تختاره | ✔ | ✔ |
| `SEED_ADMIN_PASSWORD` | تختاره | ✔ | ✔ |
| `CF_ACCOUNT_ID` | Cloudflare ← R2 ← Overview | ✔ | ✔ |
| `CF_ACCESS_KEY_ID` | Cloudflare ← R2 ← API Tokens | ✔ | ✔ |
| `CF_SECRET_ACCESS_KEY` | Cloudflare ← R2 ← API Tokens (**يُعرض مرة واحدة**) | ✔ | ✔ |
| `CF_PUBLIC_URL` | Cloudflare ← R2 ← `rvios-media` ← Settings ← Public URL | ✔ | ✔ |
| `CF_BUCKET_NAME` | `rvios-media` | ✔ | ✔ |
| `CORS_ORIGINS` | نطاقات Vercel الثلاثة، مفصولة بفواصل | ✔ | ✖ |
| `NODE_VERSION` · `JWT_EXPIRES_IN` · `JWT_REFRESH_EXPIRES_IN` | ثوابت | ✔ | ✔ |

**Vercel لا يأخذ أي سرّ.** `NEXT_PUBLIC_API_URL` في `vercel.json` لكل واجهة —
قيم `NEXT_PUBLIC_*` تُحقن في حزمة المتصفّح فهي علنية بحكم تعريفها.

**لماذا نسختان:** Render يخدم الإنتاج. و`rvios-api/.env` يشغّل الهجرات
والبذر من جهازك — لأن `Pre-Deploy` وShell ميزتان مدفوعتان على Render
(انظر [DEPLOY.md](DEPLOY.md)). فالقيمتان يجب أن تتطابقا.

### توليد أسرار JWT

```powershell
$b = New-Object byte[] 32; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b); -join ($b | ForEach-Object { $_.ToString('x2') })
```

مرتين — قيمة لكل متغيّر. **لا تستخدم `Get-Random`**: مولّد شبه‑عشوائي
قابل للتنبّؤ من بذرته، ولا يصلح لسرّ يوقّع رموز الدخول.

بديل بـ openssl (موجود مع Git، لكنه ليس على مسار PowerShell):

```powershell
& "C:\Program Files\Git\usr\bin\openssl.exe" rand -hex 32
```

---

## تدوير مفاتيح R2 — بالترتيب

الترتيب ليس تفصيلاً: **أبطل القديم بعد التحقّق من الجديد**، وإلا انقطع
رفع الصور بين الخطوتين.

**١. أنشئ رمزاً جديداً**
Cloudflare ← **R2** ← **API** ← **Manage API Tokens** ← **Create API Token**

| الحقل | القيمة |
|---|---|
| Permissions | **Object Read & Write** |
| Specify buckets | `rvios-media` وحدها — لا "All buckets" |
| TTL | بلا انتهاء، أو حدّده إن أردت تدويراً دورياً |

قصر الصلاحية على الحاوية والعمليات المطلوبة يجعل أي تسريب لاحق أقلّ ضرراً.

**٢. انسخ القيمتين فوراً**
`Access Key ID` و`Secret Access Key` — **الثانية تُعرض مرة واحدة ولا تُسترجع**.
إن أغلقت الصفحة قبل نسخها، احذف الرمز وأنشئ غيره.

**٣. ضعهما في Render**
[Environment](https://dashboard.render.com/web/srv-da91rv5g1s2s738uemng) ←
`CF_ACCESS_KEY_ID` و`CF_SECRET_ACCESS_KEY`. الحفظ يعيد تشغيل الخدمة تلقائياً.

**٤. ضعهما في `rvios-api/.env`** بنفس القيم.

**٥. تحقّق قبل الإبطال**
انتظر انتهاء النشر، ثم من لوحة التحكم ارفع صورة في أي مشروع. نجاح الرفع
يعني أن الرمز الجديد يعمل.

**٦. الآن أبطل القديم**
Cloudflare ← R2 ← API Tokens ← الرمز القديم ← **Delete**.

**٧. تأكّد**
أعد رفع صورة. إن نجح، فالمنظومة تعمل على الرمز الجديد وحده — وقد أُبطل
التسريب فعلياً لا نظرياً.

---

## الحواجز المُفعَّلة

| الحاجز | أين | ماذا يمنع |
|---|---|---|
| `.gitignore` مُحصَّن | [.gitignore](.gitignore) | `.env` ومشتقّاته · `*.pem` · `*.key` · `node_modules/` · `dist/` |
| خطّاف pre-commit | [.githooks/pre-commit](.githooks/pre-commit) | يوقف الـ commit محلياً قبل وصوله GitHub |
| حارس الأسرار في CI | [.github/workflows/ci.yml](.github/workflows/ci.yml) | يُفشل أي push أو PR يُدخل سرّاً أو `node_modules` |
| GitHub secret scanning + push protection | إعدادات GitHub | أوقف دفعاً فعلياً حين حاول مفتاح Supabase المرور |
| حماية الفرع `main` | إعدادات GitHub | لا force-push ولا حذف · تاريخ خطّي |
| Dependabot | إعدادات GitHub | تنبيهات وتحديثات أمنية للاعتماديات |
| Data API معطَّل في Supabase | إعدادات Supabase | مفاتيح `anon` و`publishable` لا تصل إلى أي جدول |

**المستودع عام.** لا سرّ فيه — تحقّقنا بمسح المحتوى لا الأسماء فقط —
لكن هذا يعني أن أي خطأ مستقبلي يُنشر فوراً. الحواجز أعلاه هي ما يقف بينك
وبين تكرار ما حدث.

### تفعيل الخطّاف المحلي (مرة واحدة لكل نسخة)

```bash
git config core.hooksPath .githooks
```

يعمل على ويندوز عبر Git Bash المرفق مع Git for Windows.

---

## مفتاح Supabase `service_role` — باطل، لكن النظافة ناقصة

المفتاح في `lib/core/services/supabase_config.dart:14` بمشروع `RVIOS_APP`،
ويشير إلى مشروع Supabase `psjlycjbaiacdzvtewvi`.

**تحقّقنا في 2026-08-29: ذلك المشروع محذوف.** نطاقه `psjlycjbaiacdzvtewvi.supabase.co`
لا يُحلّ في DNS أصلاً، بينما مشاريع الحساب الحيّة تُحلّ إلى `172.64.149.246`
وتردّ 401. فالمفتاح يشير إلى لا شيء ولا يفتح شيئاً.

**تصحيح لتوثيق سابق:** `RVIOS_APP_ANALYSIS.md` نسب التسريب إلى
`github.com/eng-rayash/Mudiri`. الصحيح أن commit `3d49105` **ليس** في الفرع
الرئيسي لـ `Mudiri` (وهو خاص أصلاً)، بل في **`github.com/eng-rayash/Mudiri-app`
وهو عام** — وليس في تاريخه فحسب، بل في أحدث نسخة من الملف.

### ما يبقى — نظافة لا خطر

مستودع عام يحمل سلسلة `sb_secret_…` في ملف حيّ:

- ترصده ماسحات الأسرار وتفتح تنبيهات عنه بلا داعٍ
- ويرسّخ نمطاً خطيراً: مفتاح خادمي داخل تطبيق عميل يُفكّ بـ `strings`
  من أي APK

وبما أن المشروع مستغنى عنه، فالأنظف حذف `Mudiri-app` أو تحويله إلى خاص.
وإن أُبقي، فاحذف السطر من الملف.

**القاعدة التي يوضّحها هذا:** لا يوضع مفتاح `service_role` في تطبيق عميل
أبداً — لا معلّقاً عليه بتحذير، ولا "مؤقتاً". يعيش في متغيّرات بيئة
Edge Functions وحدها.

---

## القواعد

1. **لا سرّ في git.** القيم الحقيقية في لوحة Render و`rvios-api/.env` المحلي.
2. **`.env.example` عناصر نائبة فقط** — لا قيمة عاملة واحدة.
3. **لا تُزل كتلة الأسرار** من `.gitignore`.
4. **لا تلصق سرّاً في محادثة** — ولا في تذكرة ولا رسالة. الملف المحلي المتجاهَل هو المكان.
5. **لا `prisma db push` في أي مسار نشر** — انظر [DEPLOY.md](DEPLOY.md).
6. عند الشكّ في تسريب: **دوّر أولاً، وحقّق ثانياً.**

## الإبلاغ عن ثغرة

راسل مالك المستودع مباشرة. لا تفتح issue عامّاً بتفاصيل ثغرة غير مُصلَحة.
