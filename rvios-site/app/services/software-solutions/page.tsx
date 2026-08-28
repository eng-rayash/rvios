import ServicePageTemplate from "@/components/ServicePageTemplate";

export default function SoftwareSolutionsPage() {
  return (
    <ServicePageTemplate
      eyebrow="RVIOS SOFTWARE SOLUTIONS"
      title="أنظمة برمجية مبنية حسب احتياجك"
      tagline="من الأنظمة المؤسسية إلى التطبيقات والتكاملات — نبني حلولاً تقنية دقيقة لمشاكل عمل حقيقية."
      overview="نطوّر أنظمة مخصصة للشركات والجهات الحكومية، ومنصات SaaS وبوابات إلكترونية، وتطبيقات جوال، إضافة إلى تكاملات API وأنظمة الدفع — بنفس المعايير الهندسية التي بُنيت بها RVIOS OS."
      subServices={[
        { name: "Enterprise Systems", desc: "ERP مخصص، أنظمة حكومية، أنظمة مؤسسات." },
        { name: "Web Applications", desc: "منصات SaaS، بوابات إلكترونية، أنظمة داخلية." },
        { name: "Mobile Applications", desc: "تطبيقات Android وiOS وFlutter." },
        { name: "Integrations", desc: "ربط API، أنظمة الدفع، والأنظمة الخارجية." },
      ]}
      process={[
        { title: "الطلب", desc: "نستمع لاحتياجك الفعلي." },
        { title: "التحليل", desc: "نحدد النطاق والتقنية الأنسب." },
        { title: "العرض", desc: "نرسل عرضاً وجدولاً زمنياً واضحاً." },
        { title: "التنفيذ", desc: "بناء، اختبار، وتسليم مرحلي." },
      ]}
    />
  );
}
