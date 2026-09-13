/**
 * خدمات RVIOS — المصدر الوحيد.
 *
 * تقرأ منه الرئيسية، وصفحة الخدمات، وصفحات التفاصيل، والفوتر، ونموذج
 * التواصل، والـsitemap. كانت كل واحدة منها تحمل نسختها الخاصة من القائمة
 * فتباعدت نصوصها مع الوقت.
 *
 * الهيكل هنا هو المعتمد من RVIOS (٦ خدمات). المسارات القديمة تُحوَّل بـ 301
 * في next.config.mjs — عدّلها هناك إن تغيّر أي slug.
 */

export type ServiceSlug =
  | "web-design"
  | "web-development"
  | "web-systems"
  | "ecommerce"
  | "landing-pages"
  | "website-care";

export type SubService = {
  title: string;
  en: string;
  desc: string;
};

export type Service = {
  id: string;
  slug: ServiceSlug;
  nameAr: string;
  nameEn: string;
  /** سطر البطاقة في الرئيسية وصفحة الخدمات */
  descAr: string;
  descEn: string;
  tags: string[];
  /**
   * خلفية البطاقة ورأس صفحة الخدمة. تُحمَّل كـ background-image لا <Image>:
   * إن لم يكن الملف موجوداً بعد يبقى التدرّج وحده بلا صورة مكسورة.
   * المواصفات والأسماء في public/images/services/README.md
   */
  image: string;
  /** عنوان صفحة التفاصيل على سطرين — الثاني باهت */
  heroTitle: [string, string];
  heroDesc: string;
  subServicesBadge: string;
  subServicesTitle: string;
  subServices: SubService[];
  /** شريط المنهجية — اختياري */
  process?: { title: string; desc: string; steps: string[] };
  cta: { titleAr: string; titleEn: string; button: string };
};

export const SERVICES: Service[] = [
  {
    id: "01",
    slug: "web-design",
    nameAr: "تصميم المواقع",
    nameEn: "Web Design",
    descAr: "نصمم تجارب ويب مبنية حول علامتك التجارية وجمهورك، تجمع الجمال بالوضوح.",
    descEn: "Design experiences built around your brand and audience.",
    tags: ["UI/UX", "Website Design", "Design Systems", "User Experience"],
    image: "/images/services/web-design.webp",
    heroTitle: ["تصميم", "المواقع"],
    heroDesc:
      "نصمم مواقع ويب مخصصة تعكس هوية علامتك وتخاطب جمهورك بوضوح — من تصميم الواجهات وتجربة المستخدم إلى نظام تصميم متكامل.",
    subServicesBadge: "What We Design — ماذا نصمم",
    subServicesTitle: "خدمات تصميم المواقع",
    subServices: [
      {
        title: "تصميم الواجهات",
        en: "UI/UX",
        desc: "واجهات واضحة وجذابة تُبنى حول سلوك جمهورك وتقوده إلى الخطوة التالية بسهولة.",
      },
      {
        title: "تصميم المواقع",
        en: "Website Design",
        desc: "تصميم كامل لصفحات موقعك بهوية بصرية متسقة على كل المقاسات.",
      },
      {
        title: "أنظمة التصميم",
        en: "Design Systems",
        desc: "مكتبة مكوّنات وألوان وخطوط موحّدة تحفظ اتساق موقعك وتسرّع تطويره.",
      },
      {
        title: "تجربة المستخدم",
        en: "User Experience",
        desc: "رحلة زائر مدروسة تقلّل الاحتكاك وتوصله إلى ما يريد بأقل عدد من الخطوات.",
      },
    ],
    process: {
      title: "منهجية التصميم لدينا",
      desc: "نتبع منهجية مدروسة تضمن أن كل قرار تصميمي مبني على بيانات حقيقية ويخدم أهداف أعمالك.",
      steps: ["Discover", "Define", "Design", "Prototype", "Test", "Deliver"],
    },
    cta: {
      titleAr: "هل تريد موقعاً يعكس علامتك؟",
      titleEn: "Want a website that reflects your brand?",
      button: "تواصل معنا — Let's Design Together",
    },
  },
  {
    id: "02",
    slug: "web-development",
    nameAr: "تطوير المواقع",
    nameEn: "Web Development",
    descAr: "نطوّر مواقع سريعة وآمنة وقابلة للتوسع بأحدث تقنيات الويب.",
    descEn: "Fast, scalable websites built with modern technology.",
    tags: ["Corporate Websites", "Custom Websites", "Next.js / React", "CMS & API"],
    image: "/images/services/web-development.webp",
    heroTitle: ["تطوير", "المواقع"],
    heroDesc:
      "نحوّل التصميم إلى موقع سريع وآمن وسهل الإدارة — من مواقع الشركات إلى المواقع المخصصة المبنية بـ Next.js وReact.",
    subServicesBadge: "What We Build — ماذا نبني",
    subServicesTitle: "خدمات تطوير المواقع",
    subServices: [
      {
        title: "مواقع الشركات",
        en: "Corporate Websites",
        desc: "مواقع تعرض شركتك وخدماتك باحترافية وتبني ثقة العميل من أول زيارة.",
      },
      {
        title: "مواقع مخصصة",
        en: "Custom Websites",
        desc: "مواقع مبنية من الصفر حسب احتياجك، بلا قوالب جاهزة ولا قيود.",
      },
      {
        title: "تطوير Next.js / React",
        en: "Next.js / React",
        desc: "تطوير بأحدث تقنيات الويب لمواقع سريعة وآمنة وسهلة التوسع.",
      },
      {
        title: "ربط CMS وواجهات API",
        en: "CMS & API Integration",
        desc: "لوحة تحكم تحدّث منها المحتوى بنفسك، وربط بالخدمات التي تعتمد عليها.",
      },
    ],
    cta: {
      titleAr: "جاهز تبني موقعك؟",
      titleEn: "Ready to build your website?",
      button: "تواصل معنا — Let's Build",
    },
  },
  {
    id: "03",
    slug: "web-systems",
    nameAr: "أنظمة وتطبيقات الويب",
    nameEn: "Web Systems & Applications",
    descAr: "أنظمة وتطبيقات مخصصة تدير أعمالك من مكان واحد.",
    descEn: "Custom systems and applications that run your business.",
    tags: ["Custom Systems", "Dashboards", "Portals", "SaaS Platforms", "Web Apps", "Mobile Apps"],
    image: "/images/services/web-systems.webp",
    heroTitle: ["أنظمة", "وتطبيقات الويب"],
    heroDesc:
      "أنظمة ويب مخصصة للشركات — لوحات تحكم وبوابات ومنصات SaaS وتطبيقات ويب وموبايل مبنية حول طريقة عملك لا حول قالب جاهز.",
    subServicesBadge: "What We Build — ماذا نبني",
    subServicesTitle: "خدمات الأنظمة والتطبيقات",
    subServices: [
      {
        title: "أنظمة ويب مخصصة للشركات",
        en: "Custom Business Systems",
        desc: "أنظمة تُبنى حول إجراءات عملك الفعلية لتدير بياناتك وعملياتك في مكان واحد.",
      },
      {
        title: "لوحات التحكم",
        en: "Dashboards",
        desc: "لوحات تعرض مؤشرات أعمالك وبياناتك لحظياً لتتخذ قرارك على أرقام لا تقديرات.",
      },
      {
        title: "البوابات الإلكترونية",
        en: "Portals",
        desc: "بوابات للعملاء أو الموظفين أو الشركاء بحسابات وصلاحيات منفصلة.",
      },
      {
        title: "منصات SaaS",
        en: "SaaS Platforms",
        desc: "منصات بالاشتراك متعددة المستخدمين، من الحسابات والصلاحيات إلى الفوترة.",
      },
      {
        title: "تطبيقات الويب",
        en: "Web Applications",
        desc: "تطبيقات تعمل في المتصفح بلا تثبيت، بأداء قريب من التطبيقات المكتبية.",
      },
      {
        title: "تطبيقات الموبايل",
        en: "Mobile Apps",
        desc: "تطبيقات للهواتف تمتد بنظامك إلى جيب عميلك أو موظفك.",
      },
    ],
    cta: {
      titleAr: "لديك نظام أو تطبيق في ذهنك؟",
      titleEn: "Have a system or an app in mind?",
      button: "تواصل معنا — Let's Talk",
    },
  },
  {
    id: "04",
    slug: "ecommerce",
    nameAr: "المتاجر الإلكترونية",
    nameEn: "E-commerce",
    descAr: "متاجر إلكترونية مصممة لتجربة تسوق أسهل ومبيعات أكثر.",
    descEn: "Online stores designed for better shopping experiences.",
    tags: ["Online Stores", "Product Experiences", "Checkout", "Orders Management"],
    image: "/images/services/ecommerce.webp",
    heroTitle: ["المتاجر", "الإلكترونية"],
    heroDesc:
      "نصمم ونطوّر متاجر إلكترونية تجعل الشراء سهلاً وممتعاً — من عرض المنتجات إلى إتمام الطلب وإدارته.",
    subServicesBadge: "What We Build — ماذا نبني",
    subServicesTitle: "خدمات المتاجر الإلكترونية",
    subServices: [
      {
        title: "متاجر إلكترونية مخصصة",
        en: "Custom Online Stores",
        desc: "متجر مبني حول منتجاتك وطريقة بيعك، لا حول قيود قالب جاهز.",
      },
      {
        title: "تجربة عرض المنتجات",
        en: "Product Experiences",
        desc: "صفحات تعرض المنتج بصور ومواصفات وخيارات واضحة تساعد على قرار الشراء.",
      },
      {
        title: "سلة الشراء والدفع",
        en: "Checkout",
        desc: "خطوات دفع قصيرة وآمنة تقلّل التخلي عن السلة وتُنهي الطلب بسرعة.",
      },
      {
        title: "إدارة المنتجات والطلبات",
        en: "Products & Orders Management",
        desc: "لوحة تدير منها المنتجات والمخزون والطلبات والعملاء من مكان واحد.",
      },
    ],
    cta: {
      titleAr: "جاهز تطلق متجرك؟",
      titleEn: "Ready to launch your online store?",
      button: "تواصل معنا — Let's Talk",
    },
  },
  {
    id: "05",
    slug: "landing-pages",
    nameAr: "صفحات الهبوط",
    nameEn: "Landing Pages",
    descAr: "صفحات مركّزة مبنية لتحويل الزوار إلى عملاء.",
    descEn: "Focused pages built to turn visitors into customers.",
    tags: ["Campaign Pages", "Product Pages", "Lead Generation", "Conversion-focused"],
    image: "/images/services/landing-pages.webp",
    heroTitle: ["صفحات", "الهبوط"],
    heroDesc:
      "نبني صفحات هبوط مركّزة لهدف واحد: تحويل الزائر إلى عميل — لحملة إعلانية، أو منتج جديد، أو جمع طلبات.",
    subServicesBadge: "What We Build — ماذا نبني",
    subServicesTitle: "صفحات هبوط لكل هدف",
    subServices: [
      {
        title: "صفحات الحملات",
        en: "Campaign Pages",
        desc: "صفحات لحملاتك الإعلانية تتطابق رسالتها مع الإعلان الذي جاء منه الزائر.",
      },
      {
        title: "صفحات المنتجات",
        en: "Product Pages",
        desc: "صفحة تقدّم منتجك بقصة واضحة ودعوة واحدة للشراء أو التسجيل.",
      },
      {
        title: "جمع العملاء المحتملين",
        en: "Lead Generation",
        desc: "نماذج قصيرة ومحفّزة تجمع بيانات المهتمين وتوصلها إليك مباشرة.",
      },
      {
        title: "صفحات مركّزة على التحويل",
        en: "Conversion-focused Pages",
        desc: "لكل عنصر في الصفحة هدف: عنوان واضح، ودليل ثقة، ودعوة لا تُفوَّت.",
      },
    ],
    cta: {
      titleAr: "لديك حملة أو منتج جديد؟",
      titleEn: "Launching a campaign or a new product?",
      button: "تواصل معنا — Let's Talk",
    },
  },
  {
    id: "06",
    slug: "website-care",
    nameAr: "العناية بالموقع",
    nameEn: "Website Care",
    descAr: "صيانة وتحسين ودعم مستمر لموقعك بعد الإطلاق.",
    descEn: "Ongoing maintenance, optimization and support.",
    tags: ["Maintenance", "Optimization", "Performance", "Updates", "Support"],
    image: "/images/services/website-care.webp",
    heroTitle: ["العناية", "بالموقع"],
    heroDesc:
      "إطلاق الموقع بداية الطريق لا نهايته — نتولى صيانته وتحسينه وتحديثه ودعمه باستمرار لتتفرغ لأعمالك.",
    subServicesBadge: "What We Take Care Of — ماذا نتولى",
    subServicesTitle: "خدمات العناية بالموقع",
    subServices: [
      {
        title: "الصيانة",
        en: "Maintenance",
        desc: "متابعة دورية للموقع ومعالجة أي خلل قبل أن يؤثر على زوارك.",
      },
      {
        title: "التحسين",
        en: "Optimization",
        desc: "تحسينات مبنية على بيانات الزوار تجعل موقعك أفضل شهراً بعد شهر.",
      },
      {
        title: "الأداء",
        en: "Performance",
        desc: "مراقبة سرعة الموقع واستقراره للحفاظ على تجربة سلسة ونتائج بحث أفضل.",
      },
      {
        title: "التحديثات",
        en: "Updates",
        desc: "تحديث المحتوى والمكتبات والشهادات أولاً بأول لحماية الموقع وإبقائه حديثاً.",
      },
      {
        title: "الدعم التقني",
        en: "Technical Support",
        desc: "فريق تتواصل معه مباشرة عند أي استفسار أو طلب.",
      },
    ],
    cta: {
      titleAr: "موقعك يحتاج عناية مستمرة؟",
      titleEn: "Need ongoing care for your website?",
      button: "تواصل معنا — Let's Talk",
    },
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
