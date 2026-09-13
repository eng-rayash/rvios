import Image from "next/image";
import Link from "next/link";
import MarqueeTicker from "@/components/MarqueeTicker";
import StatCounter from "@/components/StatCounter";
import Plasma from "@/components/Plasma";
import SpecularButton from "@/components/SpecularButton";
import SplitText from "@/components/SplitText";
import ScrollStack from "@/components/ScrollStack";
import ServiceCard from "@/components/ServiceCard";
import { SERVICES } from "@/lib/services";

/* ─── Data ───────────────────────────────────────────────── */

const PILLARS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    titleAr: "جودة بلا تنازل",
    titleEn: "Uncompromising Quality",
    descAr: "كل سطر كود نكتبه، وكل تصميم ننجزه، يخضع لمعايير جودة صارمة.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
    titleAr: "تسليم سريع وموثوق",
    titleEn: "Fast & Reliable Delivery",
    descAr: "نلتزم بالمواعيد ونسلّم مشاريع مكتملة تتجاوز التوقعات.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    titleAr: "شراكة حقيقية",
    titleEn: "True Partnership",
    descAr: "لسنا مجرد مزوّد خدمة، نحن شريكك التقني الاستراتيجي على المدى البعيد.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    titleAr: "حلول مخصصة",
    titleEn: "Tailored Solutions",
    descAr: "لا نقدّم حلولاً جاهزة — كل مشروع يُصمَّم من الصفر ليناسب احتياجاتك.",
  },
];

const PROCESS = [
  { step: "01", ar: "نستمع", en: "We Listen", desc: "نفهم احتياجاتك وأهدافك بعمق قبل أي خطوة." },
  { step: "02", ar: "نخطط", en: "We Plan", desc: "نضع خارطة طريق تقنية واستراتيجية دقيقة." },
  { step: "03", ar: "نبني", en: "We Build", desc: "ننفّذ المشروع بأعلى معايير الجودة." },
  { step: "04", ar: "ندعم", en: "We Support", desc: "نواصل دعمك وتطوير المنتج بعد الإطلاق." },
];

/* ─── Page ───────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <>
      {/* ══════════════════ HERO ══════════════════ */}
      <section className="relative min-h-[96vh] flex items-center justify-center overflow-hidden bg-black">
        {/* Lightfall WebGL Background */}
        <div className="absolute inset-0 z-0">
          <Plasma
            color="#EF4444"
            speed={0.6}
            direction="forward"
            scale={1.1}
            opacity={0.85}
            mouseInteractive={true}
          />
        </div>
        {/* Layered Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 pointer-events-none z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-transparent pointer-events-none z-[1]" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto animate-rise">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 mb-8">
            <span className="w-8 h-px bg-ivory/40" />
            <span className="font-body text-xs tracking-[0.35em] uppercase text-ivory/70">
              RVIOS Technologies
            </span>
            <span className="w-8 h-px bg-ivory/40" />
          </div>

          {/* Main Headline */}
          <div className="mb-4">
            <SplitText
              tag="h1"
              text="نبني مواقع وأنظمة ويب تدفع نمو أعمالك"
              className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1] text-ivory"
              delay={70}
              duration={1}
              ease="power3.out"
              splitType="words"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
            />
          </div>

          {/* English subtitle */}
          <p className="font-body text-base sm:text-lg tracking-[0.12em] text-ivory/50 uppercase mb-6">
            We build websites and web systems that drive your business growth
          </p>

          {/* Description */}
          <p className="font-body text-base sm:text-lg leading-relaxed text-ivory/75 max-w-2xl mx-auto mb-10">
            تصميم وتطوير المواقع، وأنظمة وتطبيقات الويب، والمتاجر الإلكترونية — منصة ويب تبني حضورك الرقمي وتطوّره باستمرار
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact">
              <SpecularButton
                size="lg"
                radius={18}
                lineColor="#EF4444"
                baseColor="#80000A"
                tint="#EF4444"
                tintOpacity={0.15}
                textColor="#ffffff"
                intensity={1.2}
                shineSize={12}
                shineFade={35}
                thickness={1.5}
                followMouse={true}
                proximity={250}
              >
                <span>ابدأ مشروعك</span>
                <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </SpecularButton>
            </Link>
            <Link href="/services">
              <SpecularButton
                size="lg"
                radius={18}
                lineColor="#ffffff"
                baseColor="#404040"
                tint="#ffffff"
                tintOpacity={0.05}
                textColor="#f5f5f5"
                intensity={1}
                shineSize={10}
                shineFade={40}
                thickness={1}
                followMouse={true}
                proximity={250}
              >
                <span>اكتشف خدماتنا</span>
              </SpecularButton>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 scroll-indicator">
          <span className="font-body text-[0.6rem] tracking-[0.3em] text-ivory/40 uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-ivory/30 to-transparent" />
        </div>
      </section>

      {/* ══════════════════ MARQUEE ══════════════════ */}
      <MarqueeTicker />

      {/* ══════════════════ SERVICES ══════════════════ */}
      <section id="services" className="bg-surface py-24 px-6">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-14 flex flex-col items-start">
            <span className="badge-en mb-4">Our Services — خدماتنا</span>
            <SplitText
              tag="h2"
              text="من التصميم إلى الإطلاق وما بعده"
              className="font-display text-4xl md:text-5xl text-ink leading-tight max-w-2xl"
              delay={60}
              duration={1}
              ease="power3.out"
              splitType="words"
              textAlign="start"
            />
            <p className="mt-4 font-body text-base text-ink-muted max-w-xl leading-relaxed">
              نصمم ونطوّر مواقع ويب مخصصة تمنح أعمالك حضوراً أجمل، وأداءً أسرع، ونمواً حقيقياً على الإنترنت.
            </p>
          </div>

          {/* ScrollStack Cards */}
          <ScrollStack useWindowScroll={true} itemDistance={50} itemStackDistance={20} baseScale={0.92} itemScale={0.02}>
            {SERVICES.map((s) => (
              <ServiceCard key={s.id} service={s} maxTags={4} />
            ))}
          </ScrollStack>

          {/* View All Link */}
          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-body text-sm text-primary hover:text-primary-dark font-bold transition-colors border-b border-primary/30 pb-0.5"
            >
              استعرض جميع الخدمات — View All Services
              <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════ STATS ══════════════════ */}
      <section className="bg-ink py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-ivory/10">
            {[
              { end: 50, suffix: "+", label: "مشروع منجز", en: "Projects Delivered" },
              { end: 5, suffix: "+", label: "سنوات خبرة", en: "Years of Experience" },
              { end: 100, suffix: "%", label: "رضا العملاء", en: "Client Satisfaction" },
            ].map((stat) => (
              <div key={stat.label} className="text-center py-6 md:py-0 md:px-12">
                <div className="font-display text-6xl md:text-7xl text-ivory mb-2 leading-none">
                  <StatCounter end={stat.end} suffix={stat.suffix} />
                </div>
                <p className="font-body text-base font-bold text-ivory/85">{stat.label}</p>
                <p className="font-body text-xs tracking-[0.18em] uppercase text-ivory/35 mt-1">{stat.en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ WHY RVIOS ══════════════════ */}
      <section className="bg-surface-alt py-24 px-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-14">
            <span className="badge-en mb-4">Why RVIOS — لماذا نحن</span>
            <SplitText
              tag="h2"
              text="ما يميّزنا عن غيرنا"
              className="font-display text-4xl md:text-5xl text-ink"
              delay={60}
              duration={1}
              ease="power3.out"
              splitType="words"
              textAlign="center"
            />
          </div>

          {/* Pillars Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p) => (
              <div key={p.titleEn} className="card p-7">
                <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center text-primary mb-5">
                  {p.icon}
                </div>
                <h3 className="font-display text-lg text-ink mb-1">{p.titleAr}</h3>
                <p className="font-body text-xs tracking-[0.15em] uppercase text-primary/60 mb-3">{p.titleEn}</p>
                <p className="font-body text-sm leading-relaxed text-ink-muted">{p.descAr}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ PROCESS ══════════════════ */}
      <section className="bg-surface py-24 px-6">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-14">
            <span className="badge-en mb-4">How We Work — آلية العمل</span>
            <SplitText
              tag="h2"
              text="من الفكرة إلى الإطلاق"
              className="font-display text-4xl md:text-5xl text-ink"
              delay={60}
              duration={1}
              ease="power3.out"
              splitType="words"
              textAlign="center"
            />
            <p className="mt-4 font-body text-base text-ink-muted max-w-lg mx-auto">
              منهجية عمل واضحة ومثبتة تضمن تسليم مشروعك في الوقت والميزانية المحددة.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS.map((p, i) => (
              <div key={p.step} className="relative">
                {/* Connector line */}
                {i < PROCESS.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-0 w-full h-px bg-gradient-to-l from-transparent via-primary/20 to-transparent" />
                )}
                <div className="card p-7">
                  {/* Step Number */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className="font-body text-xs tracking-[0.25em] text-primary/60 uppercase">{p.step}</span>
                    <div className="flex-1 h-px bg-primary/10" />
                  </div>
                  {/* Circle step */}
                  <div className="w-12 h-12 rounded-full bg-primary/8 border border-primary/15 flex items-center justify-center mb-5">
                    <span className="font-display text-sm text-primary font-bold">{p.step}</span>
                  </div>
                  <h3 className="font-display text-xl text-ink mb-1">{p.ar}</h3>
                  <p className="font-body text-xs tracking-[0.18em] uppercase text-primary/50 mb-3">{p.en}</p>
                  <p className="font-body text-sm leading-relaxed text-ink-muted">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ CTA ══════════════════ */}
      <section className="relative overflow-hidden bg-ink py-28 px-6">
        {/* Background decoration */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/15 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-primary/10 blur-[60px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8">
            <span className="w-6 h-px bg-primary/60" />
            <span className="font-body text-xs tracking-[0.35em] uppercase text-primary">
              Start Your Project
            </span>
            <span className="w-6 h-px bg-primary/60" />
          </div>

          <div className="mb-4">
            <SplitText
              tag="h2"
              text="هل لديك مشروع ويب؟"
              className="font-display text-4xl sm:text-5xl text-ivory leading-tight"
              delay={60}
              duration={1}
              ease="power3.out"
              splitType="words"
              textAlign="center"
            />
          </div>
          <p className="font-body text-base sm:text-lg tracking-[0.1em] text-ivory/40 uppercase mb-6">
            Got a web project in mind?
          </p>
          <p className="font-body text-base text-ivory/65 leading-relaxed mb-10 max-w-xl mx-auto">
            تواصل معنا اليوم ونبدأ العمل معاً على تحويل فكرتك إلى واقع رقمي مؤثر.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary text-base px-8 py-4">
              ابدأ الآن — Get Started
              <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href="https://wa.me/967739008083"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-ivory text-base px-8 py-4"
            >
              واتساب خدمة العملاء
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
