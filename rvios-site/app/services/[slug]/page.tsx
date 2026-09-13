import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SERVICES, getService } from "@/lib/services";

interface Props {
  params: Promise<{ slug: string }>;
}

/* الخدمات ثابتة في lib/services — أي slug آخر 404 بدل صفحة فارغة.
   المسارات القديمة لا تصل هنا أصلاً: تُحوَّل في next.config.mjs. */
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return {
    title: `${s.nameAr} — ${s.nameEn} | RVIOS`,
    description: `${s.descAr} ${s.descEn}`,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  return (
    <>
      {/* Hero — صورة الخدمة تحت تدرّج حبري */}
      <section className="relative bg-ink text-ivory py-28 px-6 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${s.image}')` }}
        />
        {/* حاجب ثابت + تدرّج اتجاهي: الصور نفسها فاتحة ومزدحمة، والتدرّج
            وحده لم يكن يكفي لقراءة العنوان والفقرة فوقها. */}
        <div aria-hidden className="absolute inset-0 bg-[rgb(var(--color-ink-900-ch)/0.4)]" />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--color-ink-900-ch))] via-[rgb(var(--color-ink-900-ch)/0.9)] to-[rgb(var(--color-ink-900-ch)/0.55)] md:bg-gradient-to-l md:from-[rgb(var(--color-ink-900-ch))] md:via-[rgb(var(--color-ink-900-ch)/0.9)] md:to-[rgb(var(--color-ink-900-ch)/0.3)]"
        />
        <div
          aria-hidden
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/12 blur-[100px] pointer-events-none"
        />

        <div className="mx-auto max-w-4xl relative z-10">
          <div className="flex items-center gap-3 mb-6">
            {/* لا تستخدم .badge-en هنا: تعريفه في globals.css يأتي بعد طبقة
                utilities فيتغلّب `background` و`color` فيه على أي bg-/text-
                يُضاف إليه — فتخرج الشارة بخلفية حمراء ٧٪ ونص داكن فوق صورة
                داكنة. تُبنى بالأدوات مباشرة لتبقى مقروءة. */}
            <span
              className="inline-block rounded-full border border-primary/40 bg-[rgb(var(--color-ink-900-ch)/0.72)] px-3 py-1 text-[0.65rem] uppercase tracking-[0.25em] text-ivory/90 backdrop-blur-sm"
              style={{ fontFamily: "var(--font-givonic), sans-serif" }}
            >
              {s.id} — {s.nameEn}
            </span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-ivory leading-tight mb-5 drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]">
            {s.heroTitle[0]}
            <br />
            <span className="text-ivory/50">{s.heroTitle[1]}</span>
          </h1>
          <p className="font-body text-base sm:text-lg text-ivory/70 leading-relaxed max-w-2xl mb-10">
            {s.heroDesc}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary px-8 py-4">
              ابدأ مشروعك
            </Link>
            <Link href="/services" className="btn-outline-ivory px-8 py-4">
              باقي الخدمات
            </Link>
          </div>
        </div>
      </section>

      {/* Sub-services */}
      <section className="bg-surface py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <span className="badge-en mb-4">{s.subServicesBadge}</span>
            <h2 className="font-display text-4xl text-ink">{s.subServicesTitle}</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {s.subServices.map((sub, i) => (
              <div key={sub.en} className="card p-7 group relative overflow-hidden">
                {/* رقم باهت يعطي القائمة إيقاعاً بصرياً */}
                <span
                  aria-hidden
                  className="absolute -top-3 left-5 font-display text-6xl text-primary/[0.07] group-hover:text-primary/[0.12] transition-colors"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-xl text-ink mb-1 relative">{sub.title}</h3>
                <p className="font-body text-xs tracking-[0.18em] uppercase text-primary/60 mb-4 relative">
                  {sub.en}
                </p>
                <p className="font-body text-sm leading-relaxed text-ink-muted relative">{sub.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Banner */}
      {s.process && (
        <section className="bg-surface-alt py-16 px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-display text-3xl text-ink mb-4">{s.process.title}</h2>
            <p className="font-body text-base text-ink-muted mb-10">{s.process.desc}</p>
            <div className="flex flex-wrap justify-center gap-3">
              {s.process.steps.map((step, i, steps) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="font-body text-sm px-4 py-2 rounded-full bg-white border border-primary/20 text-primary font-bold shadow-sm">
                    {step}
                  </span>
                  {i < steps.length - 1 && <span className="text-ink-faint text-xs">→</span>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* روابط باقي الخدمات — تُبقي الزائر داخل المسار بدل نهاية مغلقة */}
      <section className="bg-surface py-16 px-6 border-t border-black/5">
        <div className="mx-auto max-w-7xl">
          <span className="badge-en mb-6">More Services — خدمات أخرى</span>
          <div className="flex flex-wrap gap-3">
            {SERVICES.filter((o) => o.slug !== s.slug).map((o) => (
              <Link
                key={o.slug}
                href={`/services/${o.slug}`}
                className="group flex items-center gap-3 rounded-full border border-black/8 bg-white px-5 py-3 transition-all duration-300 hover:border-primary/40 hover:shadow-card"
              >
                <span className="font-display text-xs text-primary/50 group-hover:text-primary transition-colors">
                  {o.id}
                </span>
                <span className="font-body text-sm font-bold text-ink">{o.nameAr}</span>
                <span className="font-body text-[0.65rem] tracking-[0.15em] uppercase text-ink-faint">
                  {o.nameEn}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20 px-6 text-center">
        <h2 className="font-display text-4xl text-ivory mb-4">{s.cta.titleAr}</h2>
        <p className="font-body text-base text-ivory/70 mb-8">{s.cta.titleEn}</p>
        <Link
          href="/contact"
          className="bg-ivory text-primary rounded-full px-8 py-4 font-body text-base font-bold hover:bg-ivory-soft transition-colors inline-block"
        >
          {s.cta.button}
        </Link>
      </section>
    </>
  );
}
