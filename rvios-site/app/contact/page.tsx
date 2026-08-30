import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "تواصل معنا — RVIOS Technologies | Contact Us",
  description:
    "تواصل مع فريق RVIOS لمناقشة مشروعك التقني. نرد خلال 24 ساعة.",
};

const CONTACT_METHODS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    label: "البريد الإلكتروني",
    sublabel: "Email",
    value: "info@rvios.com",
    href: "mailto:info@rvios.com",
    color: "text-primary bg-primary/8",
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    label: "واتساب خدمة العملاء",
    sublabel: "Customer Support WhatsApp",
    value: "+967 739 008 083",
    href: "https://wa.me/967739008083",
    color: "text-[#25D366] bg-green-50",
    external: true,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-surface py-20 px-6 border-b border-black/6">
        <div className="mx-auto max-w-4xl">
          <span className="badge-en mb-5">Contact — تواصل</span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-ink leading-tight mb-5">
            هل لديك مشروع؟
            <br />
            <span className="text-primary">نحن هنا</span>
          </h1>
          <p className="font-body text-base sm:text-lg tracking-[0.1em] text-fg-muted uppercase mb-4">
            Got a project? We&apos;re ready.
          </p>
          <p className="font-body text-base text-ink-muted leading-relaxed max-w-xl">
            تواصل معنا لمناقشة فكرتك أو مشروعك التقني. فريقنا جاهز للرد خلال 24 ساعة
            وتقديم استشارة أولية مجانية.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="bg-surface py-16 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-5 items-start">

            {/* Left — Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact methods */}
              <div>
                <h2 className="font-display text-2xl text-ink mb-6">
                  طرق التواصل المباشر
                </h2>
                <div className="space-y-4">
                  {CONTACT_METHODS.map((m) => (
                    <a
                      key={m.sublabel}
                      href={m.href}
                      target={m.external ? "_blank" : undefined}
                      rel={m.external ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-black/6 shadow-card hover:shadow-card-hover transition-all duration-300 group"
                    >
                      <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${m.color} transition-all group-hover:scale-110`}>
                        {m.icon}
                      </span>
                      <div>
                        <p className="font-body text-xs tracking-[0.18em] uppercase text-fg-muted mb-0.5">
                          {m.sublabel}
                        </p>
                        <p className="font-body text-sm font-bold text-ink group-hover:text-primary transition-colors">
                          {m.label}
                        </p>
                        <p className="font-body text-xs text-ink-muted mt-0.5">{m.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Response time */}
              <div className="rounded-2xl bg-surface-alt border border-black/5 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-body text-xs tracking-[0.18em] uppercase text-green-600">
                    Available — متاح
                  </span>
                </div>
                <p className="font-body text-sm text-ink-muted leading-relaxed">
                  نرد على جميع الاستفسارات خلال{" "}
                  <strong className="text-ink">24 ساعة</strong> من استلام رسالتك.
                </p>
                <p className="font-body text-xs text-fg-muted mt-2 tracking-wide">
                  We respond to all inquiries within 24 hours.
                </p>
              </div>

              {/* Why choose RVIOS mini list */}
              <div>
                <h3 className="font-display text-lg text-ink mb-4">ماذا ستحصل؟</h3>
                <ul className="space-y-3">
                  {[
                    "استشارة تقنية أولية مجانية",
                    "عرض سعر تفصيلي خلال 48 ساعة",
                    "خطة عمل واضحة ومحددة",
                    "فريق تقني متخصص ومحترف",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 font-body text-sm text-ink-muted">
                      <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right — Form */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-surface-alt py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <span className="badge-en mb-4">FAQ — أسئلة شائعة</span>
            <h2 className="font-display text-3xl text-ink">أسئلة تساعدك على البدء</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "ما هي التقنيات التي تعمل بها RVIOS؟",
                a: "نعمل بمجموعة واسعة من التقنيات تشمل React, Next.js, Node.js, Python, Flutter, AWS, وغيرها. الأهم هو اختيار الأنسب لمشروعك.",
              },
              {
                q: "كم يستغرق تطوير مشروع؟",
                a: "يعتمد على حجم ونوع المشروع. التطبيق البسيط يستغرق 4-8 أسابيع، بينما الأنظمة الكبيرة تحتاج 3-6 أشهر. نحدد جدولاً زمنياً دقيقاً قبل البدء.",
              },
              {
                q: "هل تقدمون خدمة الصيانة بعد الإطلاق؟",
                a: "نعم، نوفر خدمات دعم وصيانة مستمرة بعد الإطلاق لضمان استمرارية وتطوير منتجك.",
              },
              {
                q: "What languages do you work in?",
                a: "We work in both Arabic and English, and can deliver projects in either language based on your target audience.",
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl bg-white border border-black/6 shadow-card overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-body text-base font-bold text-ink group-hover:text-primary transition-colors">
                  {faq.q}
                  <svg
                    className="w-5 h-5 text-fg-muted group-open:rotate-180 transition-transform duration-300 shrink-0"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 font-body text-sm text-ink-muted leading-relaxed border-t border-black/4 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
