# RVIOS_APP — تحليل كامل وخطة الربط بمنصة RVIOS

> تحليل بتاريخ 2026-08-08 لمشروع `F:\rvios\RVIOS_APP`.
> **ملاحظة على التحقق:** `flutter pub get` غير ممكن في هذه البيئة (pub.dev محجوب — يرجع 403)،
> لذا لم أتمكن من تشغيل `flutter analyze` أو البناء بنتائج ذات معنى.
> كل ما يلي مبني على قراءة المصدر والبحث فيه والتحقق من سجل git.
> **يجب تشغيل `flutter analyze` محلياً** لاستكمال الصورة.

---

## 1. ما هو التطبيق

تطبيق Flutter لإدارة الأعمال (ERP) متعدد المستأجرين، عربي أولاً (RTL)، اسمه في
`pubspec.yaml`: **"RVIOS — One Platform. Complete Business Management."**

| المؤشر | القيمة |
|---|---|
| كود Dart مكتوب يدوياً | **64,233 سطراً** |
| كود مولَّد (`.g.dart`) | 74,792 سطراً |
| المسارات (GoRoute) | 101 |
| جداول Drift المحلية | 48 |
| المنصات | Android, iOS, Web, Windows |
| commits | 20 |
| remote | `github.com/eng-rayash/Mudiri` |

**الوحدات المنجزة:** لوحة تنفيذية، مهام، مهام روتينية، متابعات، توجيهات، اجتماعات
ولقاءات، مواعيد، جهات اتصال، مكالمات، زيارات، حركات، ملاحظات، أرشيف مستندات
(مع ماسح ضوئي وقصّ)، مالية كاملة (دليل حسابات، قيود، فواتير، مصروفات/إيرادات،
عملاء، موردون، مشاريع، حسابات بنكية، سندات صرف، تقارير)، موارد بشرية كاملة
(موظفون، حضور، إجازات، رواتب، سلف، تقييمات، تدريب، مكافآت/جزاءات، أقسام، فروع)،
تقارير وتصدير (PDF/Excel)، بحث شامل، تايم لاين، إشعارات ذكية، اشتراكات، أمان
متعدد الطبقات (بصمة + PIN + قفل تلقائي + سجل أمني).

**التقييم:** هذا منتج ناضج فعلاً من ناحية اتساع الميزات — 4 شاشات فقط ما زالت
`ErpPlaceholderScreen`، و5 تعليقات `TODO` في المشروع كله. المشكلة ليست في الميزات
بل في **طبقة الاتصال بالسحابة**.

---

## 2. المعمارية الفعلية (وليست المعلنة)

```
┌────────────────────────────────────────────────────┐
│  الشاشات (features/*/presentation)                  │
└────────────────┬───────────────────────────────────┘
                 │ يستخدم
                 ▼
┌────────────────────────────────────────────────────┐
│  features/*/domain/*_repository.dart  → Drift      │
│  = قاعدة SQLite محلية على الجهاز فقط                │
└────────────────────────────────────────────────────┘

────────── كل ما تحته غير موصول بشيء ──────────

┌────────────────────────────────────────────────────┐
│  ✗ core/api/*            (عميل NestJS)  — كود ميت   │
│  ✗ core/supabase/*       (مستودعات)     — كود ميت   │
│  ✗ features/*/data/*     (Supabase)     — كود ميت   │
│  ✗ CloudSyncService                     — كود ميت   │
└────────────────────────────────────────────────────┘

✓ الوحيد الموصول فعلاً: Supabase Auth
  (features/auth/data/auth_repository.dart ← auth_providers.dart)
```

**الخلاصة: التطبيق يعمل محلياً 100%.** المصادقة فقط سحابية (Supabase Auth).
كل البيانات — بما فيها الشركات والأعضاء والأدوار والاشتراكات — في SQLite على الجهاز.

هذا تحقق بالبحث عن كل استيراد:

| الطبقة | الحالة |
|---|---|
| `core/api/api_client.dart`, `api_config.dart`, `api_providers.dart` | لا يستوردها أي ملف خارج `core/api/` |
| `core/supabase/base_repository.dart`, `supabase_client_provider.dart` | يستوردها ملفان فقط، وهما بدورهما غير مستوردَين |
| `features/tasks/data/tasks_repository.dart` (Supabase) | غير مستورد — الشاشات تستخدم `domain/tasks_repository.dart` (Drift) |
| `features/company/data/company_repository.dart` (Supabase) | غير مستورد |
| `core/services/cloud_sync_service.dart` | لا يشير إليه أي ملف |
| `supabase/functions/sync-company-data` | لا يُستدعى من التطبيق |

---

## 3. 🔴 حرج جداً — مفتاح Supabase `service_role` مكشوف

**الموقع:** `lib/core/services/supabase_config.dart:14`

```dart
// Secret Key (Service Role Key) - WARNING: Never expose this in production clients!
// We keep it here as requested, but we will use the Anon Key for client operations.
static const String supabaseSecretKey = 'sb_secret_<REDACTED — انظر SECURITY.md>';
```

هذا مفتاح **service_role** — يتجاوز **كل** سياسات Row Level Security.
حامله يملك قراءة وكتابة وحذفاً كاملاً على قاعدة بيانات كل المستأجرين.

**لماذا التعليق التحذيري لا يكفي:**
1. المفتاح ثابت `const` → يُحقن حرفياً في ملف APK/IPA. أي شخص يفكّ التطبيق يستخرجه بـ `strings`.
2. المفتاح **في تاريخ git** منذ commit `3d49105` على `github.com/eng-rayash/Mudiri`.
3. كونه "غير مستخدَم في الكود" لا يمنع استخراجه — التجميع لا يحذف الثوابت المعلنة.

**الإصلاح — بهذا الترتيب:**
1. **دوّر المفتاح فوراً** من Supabase Dashboard → Settings → API → Rotate service_role key.
2. احذف السطر من المصدر نهائياً.
3. المفتاح الجديد يعيش **فقط** في متغيرات بيئة Edge Functions (`Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')`) —
   وهو ما تفعله دوال `supabase/functions/*` بالفعل بشكل صحيح.
4. راجع سجلات Supabase بحثاً عن استخدام مشبوه للمفتاح القديم.

**إيجابية:** سياسات RLS موجودة فعلاً في الـ migrations (36 `CREATE POLICY` عبر
28 `ENABLE ROW LEVEL SECURITY`)، فالأساس الأمني سليم — المفتاح المكشوف هو ما يبطله.

---

## 4. 🔴 لا يوجد backend للتطبيق أصلاً

`lib/core/api/api_config.dart` يشير إلى:

```dart
baseUrl = 'https://rvios-api.onrender.com'
apiUrl  => '$baseUrl/api/v1'
```

مع مسارات: `/companies`, `/members`, `/tasks`, `/meetings`, `/follow-ups`,
`/employees`, `/finance`, `/finance/invoices`, `/finance/expenses`,
`/finance/summary`, `/storage`, `/notes`, `/contacts`.

**لكن `rvios-api` (NestJS) في المونوريبو لا يحتوي أياً من هذه المسارات.**
وحداته الفعلية: auth, posts, categories, services, projects, media, contacts
(نموذج تواصل الموقع — وليس جهات اتصال الشركة), settings, users, owner, health.
كما أنه يستخدم البادئة `api` بلا `v1` إطلاقاً.

**ومشكلة أعمق:** `ApiClient._headers()` يرفق **توكن Supabase** كـ Bearer:
```dart
final session = Supabase.instance.client.auth.currentSession;
headers['Authorization'] = 'Bearer ${session.accessToken}';
```
بينما NestJS يتحقق من توكناته الخاصة بـ `JWT_SECRET` خاص به. حتى لو وُجدت المسارات،
كل طلب سيرجع 401. الطبقتان لا تلتقيان.

---

## 5. 🔴 تعارض مخططات Supabase

ثلاث ملفات migration بمخططين متنافسين:

| الملف | الجداول | ملاحظة |
|---|---|---|
| `000_rvios_complete_schema.sql` | `rvios_companies`, `rvios_tasks`, ... (17 جدولاً) | يقول حرفياً: **«شغّل هذا الملف فقط — تجاهل 001 و 002 تماماً»** |
| `001_rvios_platform.sql` | `public.companies`, `company_members`, `invitations`, `user_profiles`, `audit_logs` | مُهمَل حسب 000 |
| `002_rvios_core_tables.sql` | `rvios_tasks`, `rvios_follow_ups`, ... | مُهمَل حسب 000 |

**التعارض:** `CloudSyncService` يكتب إلى `companies` و`company_members`
و`user_profiles` و`invitations` — أي إلى جداول **001 المُهمَلة**، لا إلى `rvios_*`.
بينما `supabase_config.dart` يعرّف ثوابت `rvios_*`. الطبقتان تستهدفان مخططين مختلفين.

كذلك جدولان يستخدمهما الكود ولا يوجدان في أي migration:
- `app_config` — يقرأ منه `RemoteConfigService` (وضع الصيانة والتحديث الإجباري)
- `error_logs` — مذكور كتعليق في `ErrorTrackingService`

**النتيجة:** وضع الصيانة والتحديث الإجباري لن يعملا — الجدول غير موجود، والاستعلام
يفشل بصمت ويعود للقيم الافتراضية.

**الإصلاح:** احذف `001` و`002` نهائياً، اعتمد `000` مرجعاً وحيداً، أضف
`rvios_app_config` و`rvios_error_logs` إليه، ووحّد كل الكود على البادئة `rvios_`.

---

## 6. 🟠 مشاكل مهمة أخرى

### 6.1 هجرات قاعدة البيانات تفشل بصمت
`lib/core/database/app_database.dart` — كل خطوة في `onUpgrade` ملفوفة بـ:
```dart
try { await m.addColumn(...); } catch (_) {}
```
إن فشلت هجرة على جهاز مستخدم، يستمر التطبيق بمخطط ناقص بلا أي إشارة، وستظهر
الأعطال لاحقاً في مكان بعيد عن السبب. في منتج تجاري هذا خطر على بيانات العملاء.
**الإصلاح:** سجّل كل فشل في `security_logs`/`error_logs` على الأقل، وافشل بصوت عالٍ
في وضع debug.

### 6.2 تعارض في رقم إصدار القاعدة
`AppConstants.dbVersion = 10` بينما `AppDatabase.schemaVersion => 11`.
الثابت غير مستخدَم في أي مكان (كود ميت) — لكنه فخ لمن يعدّل لاحقاً. احذفه.

### 6.3 لا حراسة على المسارات
`app_router.dart` (101 مساراً) بلا `redirect` على مستوى الراوتر. التوجيه يتم
من `splash_screen` فقط. أي `context.go('/dashboard')` مباشر يتجاوز فحص القفل والاشتراك.
**الإصلاح:** أضف `redirect` مركزياً يفحص: الصيانة → التحديث الإجباري → المصادقة →
القفل → وجود شركة نشطة.

### 6.4 لا يوجد دفع فعلي
`pricing_screen.dart` يعرض 5 خطط (مجاني → مؤسسي) وواجهة دفع، لكن:
```
'سيتم ربط بوابة الدفع قريباً'
// Ready to be connected to Stripe / PayTabs / HyperPay when keys are configured.
```
وأخطر من ذلك: `ModulesService` يفرض حدود الخطة **على العميل فقط**، والخطة نفسها
مخزّنة في قاعدة البيانات المحلية. أي مستخدم يستطيع ترقية نفسه إلى `enterprise`
بتعديل سجل محلي. لا يوجد أي فرض من الخادم لأنه لا يوجد خادم.

### 6.5 إعادة التسمية من "مديري" ناقصة
| الموقع | البقية |
|---|---|
| `remote_config_service.dart:16` | `storeUrl` يشير إلى `id=com.mudiri.mudiri` بينما `applicationId = com.rvios.app` — **رابط التحديث سيقود لتطبيق غير موجود** |
| `remote_config_service.dart:15` | رسالة الصيانة: «نظام مديري...» |
| `auth_service.dart:50` | نص البصمة: «للدخول إلى مديري» |
| `auth_service.dart:120` | `salt = 'mudiri_executive_pin_salt_v1'` — لا تغيّره، سيُبطل PIN كل المستخدمين |
| `file_storage_service.dart` | مجلدات التصدير `Mudiri/Archive` و`mudiri_archive` |
| `notification_service.dart` | معرّف قناة `mudiri_staggered` |
| `dashboard_screen.dart:143`, `account_screen.dart:74` | نصوص «مديري» ظاهرة للمستخدم |
| git remote | `Mudiri` |
| تعليقات رأس الملفات | «Mudiri ERP» في enums, app_database, base_table, app_router, route_names, app_currencies |

### 6.6 ازدواج وكود ميت
- **فئتا `SupabaseConfig`** — `core/services/supabase_config.dart` (تُستخدم في `main.dart`)
  و`core/supabase/supabase_config.dart` (تُستخدم في المستودعات الميتة). وحّدهما.
- `assets/mudiri_demo.sqlite` (90 KB) **غير مُعلن في `pubspec.yaml`** → لا يمكن تحميله
  وقت التشغيل. أصل ميت، ومتتبَّع في git.
- `create_demo_db.py` (95 KB) في الجذر + `bin/create_demo_db.py` (8 KB) — نسختان مختلفتان.
- ملفات متتبَّعة بالخطأ: `android/.kotlin/sessions/*.salive`، `android/build/reports/...`.
  `.gitignore` لا يغطي `android/local.properties` ولا `android/.kotlin/`.

### 6.7 حالة العمل غير الملتزَمة
```
 D README.md, DEVELOPER_GUIDE.md, QUICK_START.md,
   ARCHIVE_FILE_SYSTEM.md, IMPLEMENTATION_SUMMARY.md, PIN_KEYPAD_UPDATE.md
 M lib/core/theme/neu_colors.dart, neu_decorations.dart
 M lib/features/dashboard/presentation/dashboard_screen.dart
 M lib/shared/widgets/app_scaffold.dart, neu_card.dart
?? lib/features/dashboard/presentation/widgets/
```
كل التوثيق محذوف بلا التزام، وهناك إعادة تصميم للثيم قيد التنفيذ.
**التزم أو تراجع قبل أي عمل جديد.**

### 6.8 اختبارات ولنترات
- `test/widget_test.dart` هو الملف الوحيد — اختبار واحد لتطبيق بـ 64 ألف سطر.
- `flutter_lints` و`custom_lint` و`riverpod_lint` مثبتة، لكن `analysis_options.yaml`
  44 بايت فقط (الحد الأدنى) — `custom_lint` غير مفعّل.
- لا CI.

---

## 7. خطة الربط بمنصة RVIOS

### 7.1 القرار المعماري المطلوب أولاً

عندك **backendان** ولا يمكن إبقاء الاثنين:

| | Supabase | NestJS (`rvios-api`) |
|---|---|---|
| المصادقة | ✅ تعمل الآن في التطبيق | ✅ تعمل للموقع/اللوحة |
| المخطط | ✅ 17 جدولاً + RLS + policies | ❌ لا شيء لوحدات التطبيق |
| Realtime | ✅ جاهز | ❌ يحتاج بناء |
| التخزين | ✅ جاهز | Cloudflare R2 (جاهز) |
| Edge Functions | ✅ اثنتان مكتوبتان | — |
| العمل المتبقي للتطبيق | ربط الطبقة الموجودة | بناء ~15 وحدة من الصفر |

**توصيتي: أبقِ Supabase backend التطبيق، واجعل NestJS backend المنصة، واربطهما
عند الاشتراكات والحسابات فقط.**

السبب: إعادة بناء المالية والموارد البشرية والمزامنة والـ realtime في NestJS تعني
شهوراً من العمل لإعادة إنتاج شيء موجود ومختبَر. بينما ما ينقص فعلاً للربط
هو **طبقة واحدة**: الحسابات والاشتراكات والتراخيص.

### 7.2 المعمارية المقترحة

```
                    ┌──────────────────────────┐
                    │   rvios-api (NestJS)     │
                    │  ── مصدر الحقيقة لـ:      │
                    │  • الحسابات والاشتراكات   │
                    │  • الفوترة والتراخيص      │
                    │  • المحتوى التسويقي       │
                    └────┬──────────────┬──────┘
                         │              │
          entitlement    │              │  admin
          check (JWT)    │              │
                         ▼              ▼
    ┌────────────────────────┐   ┌──────────────────┐
    │  RVIOS_APP (Flutter)   │   │ rvios-dashboard  │
    │  Supabase: auth+data   │   │ إدارة المستأجرين  │
    │  Drift: كاش محلي        │   └──────────────────┘
    └────────────────────────┘
                         ▲
                         │
    ┌────────────────────────┐
    │  rvios-site            │
    │  صفحة المنتج + التسعير  │
    │  + روابط التحميل        │
    └────────────────────────┘
```

### 7.3 خطوات التنفيذ

**المرحلة 0 — تنظيف (قبل أي ربط)**
1. دوّر مفتاح `service_role` واحذفه من المصدر ومن التاريخ *(قسم 3)*
2. التزم أو تراجع عن العمل المعلّق *(قسم 6.7)*
3. احذف `001` و`002` من migrations ووحّد على `000` *(قسم 5)*
4. احذف طبقة `core/api/*` بالكامل — ستُعاد كتابتها لغرض مختلف *(قسم 4)*
5. أكمل إعادة التسمية، وأهمها `storeUrl` *(قسم 6.5)*

**المرحلة 1 — وصل الطبقة السحابية الموجودة**
6. أضف `rvios_app_config` و`rvios_error_logs` إلى migration 000
7. صحّح `CloudSyncService` ليستهدف جداول `rvios_*`
8. اربط `features/*/data/*_repository.dart` بالشاشات فعلياً، أو احذفها إن كان
   القرار «محلي أولاً + مزامنة دُفعية» عبر Edge Function `sync-company-data`
9. أضف حالة مزامنة مرئية للمستخدم (آخر مزامنة، عدد التغييرات المعلّقة، إعادة محاولة)

**المرحلة 2 — طبقة الاشتراكات في المنصة**
10. في `rvios-api` أضف وحدة `subscriptions`:
    - `POST /api/v1/licenses/verify` — يستقبل توكن Supabase، يتحقق منه بمفتاح
      Supabase العام (JWKS)، ويرجّع `{ plan, status, maxUsers, expiresAt, modules[] }`
    - `POST /api/v1/billing/webhook` — من بوابة الدفع
    - `GET /api/v1/companies` — للوحة التحكم (قراءة من Supabase أو نسخة متزامنة)
11. في التطبيق: أعد كتابة `ApiConfig`/`ApiClient` بحيث يخدما **هذا الغرض فقط**،
    مع تخزين النتيجة مؤقتاً (7 أيام مثلاً) للعمل دون اتصال
12. انقل فرض حدود الخطة من `ModulesService` المحلي إلى الاستحقاق المُتحقَّق منه من الخادم
13. اربط بوابة دفع فعلية (PayTabs/HyperPay للسوق الخليجي، أو Stripe)

**المرحلة 3 — الظهور كمنتج من منتجات RVIOS**
14. في `rvios-site`: صفحة `/products/app` — الميزات، لقطات، التسعير، روابط المتاجر.
    استخدم `web/landing/index.html` (819 سطراً، جاهزة) كأساس بدل كتابتها من جديد —
    مع ملاحظة أنها اليوم مكرِّرة لدور الموقع الرئيسي.
15. في `rvios-dashboard`: قسم «مستأجرو التطبيق» — الشركات، الخطط، حالة الاشتراك،
    الاستخدام. هذا ما يجعل التطبيق فعلاً «منتجاً من المنصة».
16. وحّد الهوية البصرية: التطبيق يستخدم `#8c1d24`، الموقع يستخدم `#9e2226`.
    وحّد الخطوط المشتركة (Givonic, Yapari, RTLMaghfira موجودة في الاثنين).

**المرحلة 4 — الجودة**
17. `flutter analyze` نظيف + `custom_lint` مفعّل في `analysis_options.yaml`
18. اختبارات للطبقات الحرجة: المصادقة، الهجرات، المزامنة، حسابات الرواتب والفواتير
19. CI: analyze + test + build على كل push

### 7.4 ما لا أنصح به

- **نقل التطبيق كاملاً إلى NestJS** — إعادة بناء 48 جدولاً و15 وحدة و realtime
  وتخزين وسياسات صلاحيات، مقابل مكسب معماري نظري.
- **دمج قاعدتي البيانات** — منتجان بدورتَي حياة مختلفتين؛ إبقاؤهما منفصلين مع
  عقد واضح بينهما (الاستحقاق) أسلم.
- **إطلاق تجاري قبل المرحلة 2** — بلا فرض من الخادم، كل خطة مدفوعة قابلة للتجاوز
  بتعديل سجل محلي.

---

## 8. ملخص الأولويات

| # | البند | الخطورة | القسم |
|---|---|---|---|
| 1 | تدوير مفتاح `service_role` المكشوف | 🔴 حرج | 3 |
| 2 | التزام/تراجع العمل المعلّق | 🔴 يعيق كل شيء | 6.7 |
| 3 | حسم تعارض مخططات Supabase | 🔴 يمنع أي مزامنة | 5 |
| 4 | حذف طبقة `core/api` الميتة أو إعادة توجيهها | 🔴 وهم بوجود ربط | 4 |
| 5 | `storeUrl` يشير لتطبيق غير موجود | 🟠 يكسر التحديث الإجباري | 6.5 |
| 6 | فرض الاشتراك من الخادم | 🟠 يمنع التسييل | 6.4 |
| 7 | هجرات تفشل بصمت | 🟠 خطر على بيانات العملاء | 6.1 |
| 8 | حراسة مركزية للمسارات | 🟠 | 6.3 |
| 9 | إكمال إعادة التسمية | 🟡 | 6.5 |
| 10 | تنظيف الكود والأصول الميتة | 🟡 | 6.6 |
| 11 | اختبارات + CI + lint | 🟡 | 6.8 |
