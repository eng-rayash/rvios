import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "رياش فيصل — مؤسس RVIOS Technologies | Rayash Faisal",
  description:
    "رياش فيصل، مؤسس RVIOS Technologies — مطوّر برمجيات ومصمم تقني وريادي في مجال الحلول الرقمية.",
};

const SKILLS = [
  "Full-Stack Development",
  "UI/UX Design",
  "Cloud Architecture",
  "AI & Automation",
  "Technical Consulting",
  "Product Strategy",
  "React / Next.js",
  "Node.js / NestJS",
  "TypeScript",
  "Docker / DevOps",
];

export default function RayashPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-ink text-ivory py-28 px-6 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="mx-auto max-w-4xl relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            {/* Portrait */}
            <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-2xl overflow-hidden ring-2 ring-primary/30 shrink-0">
              <Image
                src="/images/rayash-portrait.jpg"
                alt="رياش فيصل — مؤسس RVIOS"
                fill
                priority
                className="object-cover object-top"
              />
            </div>

            {/* Info */}
            <div>
              <span className="badge-en bg-primary/20 border-primary/30 text-primary mb-5">
                Founder — المؤسس
              </span>
              <h1 className="font-display text-5xl sm:text-6xl text-ivory leading-tight mb-3">
                رياش فيصل
              </h1>
              <p className="font-body text-sm tracking-[0.15em] text-ivory/40 uppercase mb-5">
                Rayash Faisal · Founder & CEO · RVIOS Technologies
              </p>
              <p className="font-body text-base text-ivory/65 leading-relaxed max-w-xl">
                مطوّر برمجيات شغوف بالتقنية وريادة الأعمال الرقمية. أسست RVIOS Technologies
                لتمكين الشركات والمؤسسات من بناء حلول رقمية متكاملة تدفع نموّها وتُحدث فارقاً حقيقياً.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="bg-surface py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <span className="badge-en mb-4">About — عن رياش</span>
          <h2 className="font-display text-3xl text-ink mb-6">من أنا؟</h2>
          <div className="space-y-4 font-body text-base text-ink-muted leading-relaxed">
            <p>
              أنا رياش فيصل، مؤسس ومدير RVIOS Technologies. بدأت مسيرتي في عالم التقنية
              من شغف حقيقي بحل المشكلات وبناء منتجات رقمية تُحدث أثراً ملموساً في حياة
              الناس والمؤسسات.
            </p>
            <p>
              أعمل على تطوير تطبيقات الويب والموبايل، وتصميم تجارب مستخدم استثنائية،
              وبناء بنى تحتية سحابية قابلة للتوسّع، فضلاً عن دمج الذكاء الاصطناعي في
              عمليات الأعمال لزيادة الكفاءة والإنتاجية.
            </p>
          </div>
        </div>
      </section>

      {/* ── Skills ── */}
      <section className="bg-surface-alt py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <span className="badge-en mb-4">Skills — المهارات</span>
          <h2 className="font-display text-3xl text-ink mb-8">التخصصات التقنية</h2>
          <div className="flex flex-wrap gap-3">
            {SKILLS.map((skill) => (
              <span
                key={skill}
                className="font-body text-sm px-5 py-2.5 rounded-full bg-white border border-primary/15 text-ink font-bold shadow-card hover:border-primary hover:text-primary transition-all duration-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-ink py-20 px-6 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-4xl text-ivory mb-4">
            هل تريد التعاون؟
          </h2>
          <p className="font-body text-base text-ivory/60 mb-8">
            Ready to build something great together?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary text-base px-8 py-4">
              تواصل معي — Get In Touch
            </Link>
            <a
              href="https://wa.me/967739008083"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-ivory text-base px-8 py-4"
            >
              تواصل مع المؤسس عبر الواتساب
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
