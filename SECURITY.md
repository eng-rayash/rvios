# الأمن — RVIOS

## ⚠️ تدوير الأسرار — إلزامي وعاجل

المستودعات الأربعة السابقة (`rvios-api`, `rvios-dashboard`, `rvios-owner`,
`rvios-site`) كانت **عامّة على GitHub**، وكان `rvios-api/.env` **متتبَّعاً في
git** ومنشوراً فيها. كما كان `.env.example` يحمل بيانات حساب المدير الحقيقية.

**نقل الكود إلى مستودع خاص لا يبطل الأسرار المكشوفة.** ما نُشر علناً يبقى
متاحاً عبر النسخ المخبّأة، والـ forks، وأرشيفات GitHub وزواحف الطرف الثالث.
الطريق الوحيد للإبطال هو التدوير من لوحة كل خدمة.

### قائمة التدوير

| السرّ | أين تُدوَّر | ملاحظة |
|---|---|---|
| `CF_ACCESS_KEY_ID` + `CF_SECRET_ACCESS_KEY` | Cloudflare → R2 → API Tokens | أنشئ زوجاً جديداً ثم **أبطل القديم** — الإنشاء وحده لا يكفي |
| `JWT_SECRET` | `openssl rand -hex 32` | يُسجَّل خروج الجميع — وهذا مطلوب |
| `JWT_REFRESH_SECRET` | `openssl rand -hex 32` | كذلك |
| كلمة مرور Postgres | Render → Postgres → Reset Password | ثم حدّث `DATABASE_URL` |
| `SEED_ADMIN_PASSWORD` + حساب المدير | قيمة جديدة ثم `pnpm db:seed` | كلمة المرور القديمة كانت في `.env.example` العام |
| `CF_ACCOUNT_ID` | لا يُدوَّر (معرّف لا سرّ) | لكنه كان مكشوفاً — راقب سجلّ الوصول إلى R2 |
| مفتاح Supabase `service_role` | Supabase → Settings → API → Rotate | **مشروع منفصل** — انظر أدناه |

### مفتاح Supabase `service_role` — تسريب منفصل

`RVIOS_APP_ANALYSIS.md` كان يقتبس مفتاح `service_role` حرفياً كدليل على
الثغرة. حُجب المفتاح في هذا المستودع، لكنه **ما زال في تاريخ git على
`github.com/eng-rayash/Mudiri`** منذ commit `3d49105` — وهو مستودع مشروع
`RVIOS_APP` لا هذا المستودع.

مفتاح `service_role` يتجاوز **كل** سياسات RLS: حامله يقرأ ويكتب ويحذف على
قواعد كل المستأجرين. رصده GitHub push protection ومنع الدفع — وهذا يعني
أن ماسحات الطرف الثالث ترصده أيضاً.

1. دوّره فوراً من لوحة Supabase.
2. احذف السطر من مصدر `RVIOS_APP` (`lib/core/services/supabase_config.dart`).
3. المفتاح الجديد في متغيّرات بيئة Edge Functions فقط.
4. راجع سجلّات Supabase بحثاً عن استخدام مشبوه للمفتاح القديم.

بعد التدوير: اضبط القيم الجديدة في **متغيّرات بيئة Render وVercel** — لا في ملف.

### تحقّق بعد التدوير

- Cloudflare → R2 → API Tokens: المفتاح القديم غير موجود في القائمة.
- Render → Postgres → Logs: لا اتصالات ناجحة بكلمة المرور القديمة.
- سجّل الدخول بكلمة مرور المدير القديمة — يجب أن يفشل.
- أي رمز JWT قديم يُرفض بـ 401.

---

## الحواجز المُفعَّلة في هذا المستودع

| الحاجز | أين | ماذا يمنع |
|---|---|---|
| `.gitignore` مُحصَّن | [.gitignore](.gitignore) | `.env` وكل مشتقّاته، `*.pem`, `*.key`, `node_modules/`, `dist/` |
| خطّاف pre-commit | [.githooks/pre-commit](.githooks/pre-commit) | يوقف الـ commit محلياً قبل أن يصل GitHub |
| حارس الأسرار في CI | [.github/workflows/ci.yml](.github/workflows/ci.yml) | يُفشل أي push أو PR يُدخل سرّاً أو `node_modules` |
| حماية الفرع `main` | إعدادات GitHub | يمنع الـ force-push وحذف الفرع |
| المستودع خاص | إعدادات GitHub | لا قراءة عامّة |

### تفعيل الخطّاف المحلي (مرة واحدة لكل نسخة)

```bash
git config core.hooksPath .githooks
```

على ويندوز يعمل الخطّاف عبر Git Bash المرفق مع Git for Windows.

---

## القواعد

1. **لا سرّ في git.** القيم الحقيقية في لوحات Render وVercel فقط.
2. **`.env.example` عناصر نائبة فقط** — لا قيمة عاملة واحدة.
3. **لا تُزل كتلة الأسرار** من `.gitignore`.
4. **لا `prisma db push` في أي مسار نشر** — انظر [DEPLOY.md](DEPLOY.md).
5. عند الشكّ في تسريب: دوّر أولاً، وحقّق ثانياً.

## الإبلاغ عن ثغرة

راسل مالك المستودع مباشرة. لا تفتح issue عامّاً بتفاصيل ثغرة غير مُصلَحة.
