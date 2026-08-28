import { MetricDirection, PrismaClient, ProjectStatus } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES = [
  { slug: 'enterprise', name: 'أنظمة المؤسسات', nameEn: 'Enterprise Systems', order: 1 },
  { slug: 'fintech', name: 'التقنية المالية', nameEn: 'Fintech', order: 2 },
  { slug: 'govtech', name: 'القطاع الحكومي', nameEn: 'GovTech', order: 3 },
  { slug: 'healthtech', name: 'الصحة الرقمية', nameEn: 'HealthTech', order: 4 },
];

const PROJECTS = [
  {
    slug: 'nuha-supply-chain',
    title: 'منصة إدارة سلسلة التوريد',
    titleEn: 'Supply Chain Management Platform',
    summary: '٣٢٪ انخفاض في تكلفة المخزون عبر ١٢ فرعاً',
    description:
      'منصة موحّدة تربط المستودعات والفروع والموردين في نظام واحد، مع تنبّؤ بالطلب وإعادة طلب تلقائية.',
    challenge:
      'كانت الفروع الاثنا عشر تدير مخزونها بجداول منفصلة، فتتكدّس أصناف في فرع وتنفد في آخر، وتُتخذ قرارات الشراء على بيانات عمرها أسبوعان.',
    solution:
      'بنينا نظام مخزون لحظي بمصدر حقيقة واحد، مع محرّك تنبّؤ يقرأ تاريخ الحركة ويولّد أوامر شراء مقترحة، ولوحة تُظهر الفجوات قبل حدوثها.',
    outcome:
      'انخفض رأس المال المجمّد في المخزون الراكد، وصار الشراء مبنياً على بيانات اليوم لا الأسبوع الماضي.',
    approach: [
      { title: 'تدقيق العمليات', desc: 'أربعة أسابيع داخل ثلاثة فروع لرسم الحركة الفعلية.' },
      { title: 'مصدر حقيقة واحد', desc: 'ترحيل اثني عشر جدولاً إلى نموذج بيانات موحّد.' },
      { title: 'محرّك التنبّؤ', desc: 'نموذج يقرأ الموسمية ومهلة التوريد لكل صنف.' },
      { title: 'الإطلاق التدريجي', desc: 'فرع واحد، ثم ثلاثة، ثم الكل خلال تسعة أسابيع.' },
    ],
    client: 'مجموعة نُهى',
    industry: 'التجزئة',
    year: 2025,
    durationMonths: 9,
    role: 'تصميم وتطوير كامل',
    teamSize: 6,
    technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'Redis', 'Docker'],
    categorySlug: 'enterprise',
    coverImageUrl: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1600&q=80',
    coverImageAlt: 'مستودع بضائع منظّم',
    testimonialQuote:
      'للمرة الأولى نرى مخزون الشركة كله في شاشة واحدة. القرار صار يأخذ دقائق بدل أيام.',
    testimonialAuthor: 'أحمد الحُميدي',
    testimonialRole: 'مدير العمليات — مجموعة نُهى',
    liveUrl: 'https://example.com',
    featured: true,
    order: 1,
    metrics: [
      { label: 'انخفاض تكلفة المخزون', value: '٣٢', unit: '٪', direction: MetricDirection.DOWN },
      { label: 'الفروع المرتبطة', value: '١٢', direction: MetricDirection.NEUTRAL },
      { label: 'تسريع دورة الشراء', value: '×٤', direction: MetricDirection.UP },
    ],
    gallery: [
      { url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1400&q=80', caption: 'لوحة المخزون اللحظي' },
      { url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1400&q=80', caption: 'شاشة أوامر الشراء المقترحة' },
    ],
  },
  {
    slug: 'rafid-banking-app',
    title: 'تطبيق الخدمات المصرفية',
    titleEn: 'Retail Banking App',
    summary: '٤٫٨ تقييم المتجر بعد إعادة البناء الكاملة',
    description:
      'إعادة بناء تطبيق مصرفي من الصفر: تحويلات، بطاقات، وتحليل إنفاق — بتجربة عربية أولاً.',
    challenge:
      'التطبيق القديم كان تقييمه ٢٫١، وأكثر الشكاوى عن بطء الدخول وتعقيد التحويل الذي كان يحتاج تسع خطوات.',
    solution:
      'أعدنا بناء التطبيق حول ثلاث مهامّ يفعلها العميل يومياً، واختصرنا التحويل إلى ثلاث خطوات، ونقلنا المصادقة إلى البصمة.',
    outcome: 'ارتفع التقييم إلى ٤٫٨ وتضاعف الاستخدام اليومي.',
    approach: [
      { title: 'بحث المستخدمين', desc: 'ثلاثون مقابلة و٩٠٠ مراجعة متجر مُصنَّفة.' },
      { title: 'إعادة تصميم المسارات', desc: 'اختصار التحويل من تسع خطوات إلى ثلاث.' },
      { title: 'أمان بلا احتكاك', desc: 'بصمة ورمز جهاز بدل كلمة المرور في كل دخول.' },
    ],
    client: 'بنك الرافد',
    industry: 'الخدمات المالية',
    year: 2024,
    durationMonths: 11,
    role: 'تصميم المنتج والتطوير',
    teamSize: 8,
    technologies: ['Flutter', 'NestJS', 'PostgreSQL', 'Redis'],
    categorySlug: 'fintech',
    coverImageUrl: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=1600&q=80',
    coverImageAlt: 'هاتف يعرض تطبيقاً مصرفياً',
    testimonialQuote: 'التقييم قفز من ٢٫١ إلى ٤٫٨ في أربعة أشهر. الأرقام تتكلّم.',
    testimonialAuthor: 'ليلى النعمان',
    testimonialRole: 'مديرة القنوات الرقمية — بنك الرافد',
    featured: true,
    order: 2,
    metrics: [
      { label: 'تقييم المتجر', value: '٤٫٨', direction: MetricDirection.UP },
      { label: 'خطوات التحويل', value: '٣', direction: MetricDirection.DOWN },
      { label: 'الاستخدام اليومي', value: '×٢٫٣', direction: MetricDirection.UP },
    ],
    gallery: [
      { url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1400&q=80', caption: 'شاشة التحويل الجديدة' },
    ],
  },
  {
    slug: 'digital-gov-portal',
    title: 'بوابة الخدمات الحكومية',
    titleEn: 'Government Services Portal',
    summary: '١٤ خدمة موحّدة في مسار واحد للمواطن',
    description:
      'بوابة تجمع خدمات أربع جهات في واجهة واحدة، بهوية رقمية موحّدة وتتبّع لحظي للطلبات.',
    challenge:
      'كان المواطن يزور أربعة مواقع بأربعة حسابات لإنهاء معاملة واحدة، ولا يعرف أين وصل طلبه.',
    solution:
      'وحّدنا الدخول بهوية واحدة، وربطنا أنظمة الجهات الأربع خلف واجهة واحدة، وأضفنا تتبّعاً لحظياً لكل طلب.',
    outcome: 'انخفض زمن إنهاء المعاملة من أيام إلى ساعات.',
    approach: [
      { title: 'رسم الخدمات', desc: 'توثيق أربع عشرة خدمة عبر أربع جهات.' },
      { title: 'الهوية الموحّدة', desc: 'دخول واحد يغطّي كل الجهات.' },
      { title: 'طبقة التكامل', desc: 'واجهات وسيطة فوق أنظمة قائمة لا تُمسّ.' },
    ],
    client: 'هيئة التحوّل الرقمي',
    industry: 'القطاع العام',
    year: 2023,
    durationMonths: 14,
    role: 'الهندسة والتكامل',
    teamSize: 11,
    technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'Keycloak', 'Docker'],
    categorySlug: 'govtech',
    coverImageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&q=80',
    coverImageAlt: 'مبنى حكومي حديث',
    featured: false,
    order: 3,
    metrics: [
      { label: 'خدمات موحّدة', value: '١٤', direction: MetricDirection.NEUTRAL },
      { label: 'زمن إنهاء المعاملة', value: '٦٨', unit: '٪', direction: MetricDirection.DOWN },
    ],
    gallery: [],
  },
  {
    slug: 'shifa-clinics',
    title: 'نظام إدارة العيادات',
    titleEn: 'Clinic Management System',
    summary: '٦٠٪ تقليص في زمن انتظار المريض',
    description:
      'نظام مواعيد وملفات طبية وفوترة لشبكة عيادات، مصمَّم للعمل السريع في الاستقبال.',
    challenge:
      'الحجز كان هاتفياً والملفات ورقية، فيقضي المريض وقتاً في الانتظار أطول من وقت الكشف نفسه.',
    solution:
      'حجز ذاتي عبر الويب، وملف طبي موحّد يفتحه الطبيب في ثانيتين، وفوترة مرتبطة بالتأمين مباشرة.',
    outcome: 'انخفض زمن الانتظار ٦٠٪ وارتفعت سعة العيادة اليومية.',
    approach: [
      { title: 'مراقبة الاستقبال', desc: 'أسبوعان لقياس أين يضيع الوقت فعلاً.' },
      { title: 'الحجز الذاتي', desc: 'نقل ٧٠٪ من الحجوزات خارج الهاتف.' },
      { title: 'الملف الموحّد', desc: 'تاريخ المريض في شاشة واحدة.' },
    ],
    client: 'مركز الشفاء',
    industry: 'الرعاية الصحية',
    year: 2023,
    durationMonths: 7,
    role: 'تصميم وتطوير كامل',
    teamSize: 5,
    technologies: ['Next.js', 'NestJS', 'PostgreSQL'],
    categorySlug: 'healthtech',
    coverImageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&q=80',
    coverImageAlt: 'استقبال عيادة حديثة',
    featured: false,
    order: 4,
    metrics: [
      { label: 'زمن انتظار المريض', value: '٦٠', unit: '٪', direction: MetricDirection.DOWN },
      { label: 'الحجز الذاتي', value: '٧٠', unit: '٪', direction: MetricDirection.UP },
    ],
    gallery: [],
  },
  {
    slug: 'mustaqbal-factory-automation',
    title: 'أتمتة خط الإنتاج',
    titleEn: 'Production Line Automation',
    summary: '×٤ سرعة اكتشاف الأعطال على أرض المصنع',
    description:
      'طبقة استشعار وتحليل فوق خط إنتاج قائم، ترصد الانحراف قبل أن يصير عطلاً.',
    challenge: 'كانت الأعطال تُكتشف عند توقّف الخط، فتكلّف ساعات إنتاج في كل مرة.',
    solution:
      'ربطنا حساسات الخط بمسار بيانات لحظي، مع تنبيهات على العتبات وتقارير أسباب جذرية.',
    outcome: 'صار الاكتشاف أسرع أربع مرات، وانخفض التوقّف غير المخطّط.',
    approach: [
      { title: 'قراءة الخط', desc: 'حصر نقاط القياس المتاحة دون تعديل العتاد.' },
      { title: 'مسار البيانات', desc: 'تدفّق لحظي مع تخزين تاريخي للتحليل.' },
      { title: 'التنبيه الذكي', desc: 'عتبات مبنية على السلوك الطبيعي لكل ماكينة.' },
    ],
    client: 'صناعات المستقبل',
    industry: 'التصنيع',
    year: 2024,
    durationMonths: 6,
    role: 'الهندسة والتحليلات',
    teamSize: 4,
    technologies: ['Python', 'NestJS', 'TimescaleDB', 'Docker'],
    categorySlug: 'enterprise',
    coverImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&q=80',
    coverImageAlt: 'خط إنتاج صناعي',
    featured: false,
    order: 5,
    metrics: [
      { label: 'سرعة اكتشاف الأعطال', value: '×٤', direction: MetricDirection.UP },
      { label: 'التوقّف غير المخطّط', value: '٤١', unit: '٪', direction: MetricDirection.DOWN },
    ],
    gallery: [],
  },
  /* مسودّة مقصودة: تُثبت أن المسارات العامة تُقصيها */
  {
    slug: 'unpublished-draft',
    title: 'مشروع قيد الإعداد',
    summary: 'هذا المشروع مسودّة ويجب ألا يظهر في المعرض العام',
    description: 'مسودّة اختبارية للتحقّق من إقصاء غير المنشور من المسارات العامة.',
    client: 'داخلي',
    industry: 'التجزئة',
    year: 2026,
    technologies: ['Next.js'],
    categorySlug: 'enterprise',
    featured: false,
    order: 99,
    draft: true,
    metrics: [],
    gallery: [],
  },
];

async function main() {
  console.log('🌱 Seeding portfolio...');

  const catBySlug = new Map<string, string>();
  for (const c of CATEGORIES) {
    const row = await prisma.projectCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name, nameEn: c.nameEn, order: c.order },
      create: c,
    });
    catBySlug.set(c.slug, row.id);
  }
  console.log(`✅ Categories: ${CATEGORIES.length}`);

  const services = await prisma.service.findMany({ select: { id: true, slug: true } });
  const svcBySlug = new Map(services.map((s) => [s.slug, s.id]));

  for (const p of PROJECTS) {
    const { categorySlug, metrics, gallery, draft, ...rest } = p as typeof p & {
      draft?: boolean;
    };

    /* حذف ثم إنشاء: يبقي السكربت قابلاً لإعادة التشغيل بلا تكديس
       للمؤشّرات والصور المرتبطة. */
    await prisma.project.deleteMany({ where: { slug: p.slug } });

    await prisma.project.create({
      data: {
        ...rest,
        approach: (rest as { approach?: unknown }).approach ?? [],
        categoryId: catBySlug.get(categorySlug),
        status: draft ? ProjectStatus.DRAFT : ProjectStatus.PUBLISHED,
        publishedAt: draft ? null : new Date(),
        metrics: { create: metrics.map((m, i) => ({ ...m, order: i })) },
        gallery: { create: gallery.map((g, i) => ({ ...g, order: i })) },
        services: {
          create: ['software-development', 'product-design']
            .map((s) => svcBySlug.get(s))
            .filter((id): id is string => Boolean(id))
            .map((serviceId) => ({ serviceId })),
        },
      },
    });
  }

  const published = PROJECTS.filter((p) => !('draft' in p && p.draft)).length;
  console.log(`✅ Projects: ${published} منشور + ${PROJECTS.length - published} مسودّة`);
  console.log('\n🎉 Portfolio seeded');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
