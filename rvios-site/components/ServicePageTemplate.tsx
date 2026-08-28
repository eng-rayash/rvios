import GlassButton from "@/components/GlassButton";
import ChevronDivider from "@/components/ChevronDivider";

type SubService = { name: string; desc: string };
type ProcessStep = { title: string; desc: string };

type ServicePageProps = {
  eyebrow: string; // مثال: "RVIOS SOFTWARE SOLUTIONS"
  title: string;
  tagline: string;
  overview: string;
  subServices: SubService[];
  process: ProcessStep[];
};

export default function ServicePageTemplate({
  eyebrow,
  title,
  tagline,
  overview,
  subServices,
  process,
}: ServicePageProps) {
  return (
    <>
      {/* ================= Hero ================= */}
      <section className="relative overflow-hidden bg-rvios-radial">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
          <span className="font-body text-sm tracking-[0.3em] text-gold">
            {eyebrow}
          </span>
          <h1 className="mt-6 font-display text-4xl leading-tight text-ink md:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl font-body text-base leading-loose text-ink-muted">
            {tagline}
          </p>
        </div>
      </section>

      <ChevronDivider />

      {/* ================= نظرة عامة ================= */}
      <section className="mx-auto max-w-3xl px-6 py-12 text-center">
        <p className="font-body text-base leading-relaxed text-ink-muted">
          {overview}
        </p>
      </section>

      {/* ================= الأقسام الفرعية ================= */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-5 sm:grid-cols-2">
          {subServices.map((s) => (
            <div key={s.name} className="card rounded-2xl p-7">
              <h3 className="font-display text-lg text-gold">{s.name}</h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-ink-muted">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <ChevronDivider />

      {/* ================= آلية العمل ================= */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-center font-display text-2xl text-ink md:text-3xl">
          آلية العمل
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((p, i) => (
            <div key={p.title} className="relative">
              <div className="card rounded-2xl p-6">
                <h4 className="font-display text-sm text-ink">{p.title}</h4>
                <p className="mt-2 font-body text-xs leading-relaxed text-ink-muted">
                  {p.desc}
                </p>
              </div>
              {i < process.length - 1 && (
                <span className="absolute -left-4 top-1/2 hidden -translate-y-1/2 font-display text-gold lg:block">
                  ←
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="font-display text-2xl text-ink md:text-3xl">
          لديك مشروع أو استفسار؟
        </h2>
        <p className="mt-4 font-body text-sm text-ink-muted">
          هذه خدمة تُقدَّم حسب احتياج كل عميل — تواصل معنا لعرض مبدئي.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <GlassButton href="/services" variant="ghost">
            كل الخدمات
          </GlassButton>
          <GlassButton href="mailto:hello@rvios.com" variant="primary">
            تواصل معنا
          </GlassButton>
        </div>
      </section>
    </>
  );
}
