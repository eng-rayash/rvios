"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import HeroCanvas from "@/components/rayash/HeroCanvas";
import AboutCanvas from "@/components/rayash/AboutCanvas";
import SkillsCanvas from "@/components/rayash/SkillsCanvas";
import ServicesCanvas from "@/components/rayash/ServicesCanvas";
import ProjectsCanvas from "@/components/rayash/ProjectsCanvas";
import EduVisionCanvas from "@/components/rayash/EduVisionCanvas";
import FooterCanvas from "@/components/rayash/FooterCanvas";

export default function FounderPortfolioPage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#FAF8ED] text-[#1A120F] font-sans antialiased min-h-screen selection:bg-[#9E2226] selection:text-[#FAF8ED]">
      {/* Scroll progress bar */}
      <div
        className="fixed top-0 inset-x-0 h-[3px] bg-[#9E2226] z-[100] origin-right transition-transform duration-100 ease-linear"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      {/* ===================== HERO ===================== */}
      <header className="relative min-h-screen bg-[#1A120F] text-[#FAF8ED] flex flex-col justify-center overflow-hidden pt-20 md:pt-0">
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `linear-gradient(rgba(250,248,237,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(250,248,237,0.10) 1px, transparent 1px)`,
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, #000 40%, transparent 90%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, #000 40%, transparent 90%)",
          }}
        />

        {/* 3D Canvas */}
        <HeroCanvas />

        {/* Content grid */}
        <div className="relative z-[3] max-w-6xl mx-auto w-full px-6 py-12 grid md:grid-cols-[1.4fr_0.9fr] gap-12 items-center">
          <div className="text-center md:text-right">
            <div className="font-mono text-xs tracking-[0.16em] text-[#C7484C] uppercase mb-6 flex items-center justify-center md:justify-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C7484C] animate-ping" />
              <span dir="ltr">AVAILABLE FOR PROJECTS — 2026</span>
            </div>

            <h1 className="font-display font-bold tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-4 ltr:text-left rtl:text-right" dir="ltr">
              Rayash<br />
              <span className="text-[#C7484C]">Albureihi</span>
            </h1>

            <p className="font-display font-bold text-lg sm:text-xl text-[#EDE8D6] mb-6 max-w-xl mx-auto md:mx-0">
              مهندس برمجيات ومصمم واجهات وتجارب مستخدم
            </p>

            <p className="font-body text-base text-[#FAF8ED]/75 leading-relaxed max-w-xl mb-8 mx-auto md:mx-0">
              أحوّل الأفكار إلى حلول رقمية متكاملة — من الهوية البصرية إلى الكود، ومن تجربة المستخدم إلى البنية التحتية.
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <a
                href="#projects"
                className="font-mono text-xs tracking-wider px-7 py-3.5 rounded bg-[#9E2226] text-[#FAF8ED] border border-[#9E2226] hover:bg-[#C7484C] hover:border-[#C7484C] transition-all hover:-translate-y-0.5 shadow-lg"
              >
                استعرض الأعمال
              </a>
              <a
                href="#contact"
                className="font-mono text-xs tracking-wider px-7 py-3.5 rounded text-[#FAF8ED] border border-[#FAF8ED]/35 hover:border-[#FAF8ED] transition-all hover:-translate-y-0.5"
              >
                تواصل معي
              </a>
            </div>
          </div>

          {/* Portrait with spinning gradient ring */}
          <div className="relative flex justify-center">
            <div className="relative w-[min(320px,80vw)] aspect-square rounded-full p-1.5 bg-gradient-to-tr from-[#9E2226] via-[#6E1519] to-[#C7484C] animate-[spin_14s_linear_infinite]">
              <Image
                src="/images/rayash-portrait.jpg"
                alt="رياش فيصل البريهي"
                width={320}
                height={320}
                className="w-full h-full object-cover rounded-full border-4 border-[#1A120F] animate-[spin_14s_linear_infinite_reverse]"
                priority
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FAF8ED] text-[#1A120F] font-mono text-[0.68rem] tracking-[0.08em] px-3.5 py-1.5 border border-[#9E2226] whitespace-nowrap shadow-md" dir="ltr">
              DESIGNER · ENGINEER
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 inset-x-0 mx-auto w-fit z-[3] flex flex-col items-center gap-2 font-mono text-[0.68rem] tracking-[0.14em] text-[#FAF8ED]/50">
          <span dir="ltr">SCROLL</span>
          <span className="w-px h-8 bg-gradient-to-b from-[#C7484C] to-transparent animate-bounce" />
        </div>
      </header>

      {/* ===================== ABOUT ===================== */}
      <section id="about" className="relative py-24 md:py-36 px-6 overflow-hidden">
        <div className="hidden md:block absolute top-8 right-6 md:right-12 z-10 font-mono text-xs text-[#1A120F]/40 tracking-wider" dir="ltr">
          01 / ABOUT
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-[0.7fr_1.3fr] gap-12 md:gap-16 items-center relative z-10">
          <div className="relative">
            <AboutCanvas />
          </div>

          <div>
            <div className="font-mono text-xs tracking-[0.14em] uppercase text-[#9E2226] flex items-center gap-3 mb-5" dir="ltr">
              <span className="w-6 h-px bg-[#9E2226]" />
              WHO I AM
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#1A120F] leading-tight mb-6">
              أجمع بين الجانب التقني والإبداعي
            </h2>
            <p className="font-body text-base sm:text-lg text-[#2A1D18] leading-relaxed mb-4 max-w-2xl">
              أمتلك خبرة في تطوير تطبيقات الويب والأنظمة الإدارية، مع اهتمام كبير بتصميم واجهات المستخدم الحديثة وإنشاء تجارب رقمية احترافية.
            </p>
            <p className="font-body text-base sm:text-lg text-[#2A1D18] leading-relaxed mb-8 max-w-2xl">
              أعمل على تحليل المتطلبات، تصميم الحلول، بناء الواجهات، تطوير الأنظمة، وتحسين تجربة المستخدم للوصول إلى منتجات رقمية ذات قيمة حقيقية — مهتم بالذكاء الاصطناعي، الأتمتة، والتحول الرقمي.
            </p>

            <div className="flex flex-wrap gap-8 sm:gap-12 pt-4 border-t border-[#9E2226]/20 font-mono">
              <div>
                <div className="font-display font-bold text-3xl text-[#9E2226]" dir="ltr">3+</div>
                <div className="text-xs uppercase text-[#2A1D18] tracking-wider mt-1">مشاريع مكتملة</div>
              </div>
              <div>
                <div className="font-display font-bold text-3xl text-[#9E2226]" dir="ltr">2026</div>
                <div className="text-xs uppercase text-[#2A1D18] tracking-wider mt-1">تخرج متوقع</div>
              </div>
              <div>
                <div className="font-display font-bold text-3xl text-[#9E2226]" dir="ltr">01</div>
                <div className="text-xs uppercase text-[#2A1D18] tracking-wider mt-1">هوية واحدة، تخصصات متعددة</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SKILLS ===================== */}
      <section id="skills" className="relative py-24 md:py-36 px-6 overflow-hidden bg-[#FAF8ED]">
        <SkillsCanvas />
        <div className="hidden md:block absolute top-8 right-6 md:right-12 z-10 font-mono text-xs text-[#1A120F]/40 tracking-wider" dir="ltr">
          02 / SKILLS
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="font-mono text-xs tracking-[0.14em] uppercase text-[#9E2226] flex items-center gap-3 mb-5" dir="ltr">
            <span className="w-6 h-px bg-[#9E2226]" />
            CAPABILITIES
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#1A120F] leading-tight mb-12 max-w-2xl">
            أدوات ولغات أبني بها المنتج من الفكرة حتى الإطلاق
          </h2>

          <div className="grid sm:grid-cols-2 gap-px bg-[#9E2226]/20 border border-[#9E2226]/20 shadow-sm">
            <div className="bg-[#FAF8ED] p-8">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#9E2226] mb-5 flex items-center gap-2.5" dir="ltr">
                <span className="w-1.5 h-1.5 bg-[#9E2226] rounded-sm" />
                Development
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Front-End", "Full-Stack", "React.js", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Node.js", "Flutter & Dart", "REST APIs", "Database Design"].map((tag) => (
                  <span key={tag} className="font-mono text-xs px-3 py-1.5 border border-[#9E2226]/20 text-[#2A1D18] hover:border-[#9E2226] hover:text-[#9E2226] transition-all hover:-translate-y-0.5" dir="ltr">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#FAF8ED] p-8">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#9E2226] mb-5 flex items-center gap-2.5" dir="ltr">
                <span className="w-1.5 h-1.5 bg-[#9E2226] rounded-sm" />
                UI / UX Design
              </h3>
              <div className="flex flex-wrap gap-2">
                {["UI Design", "UX Design", "Wireframing", "Prototyping", "Design Systems", "Figma", "Responsive Design"].map((tag) => (
                  <span key={tag} className="font-mono text-xs px-3 py-1.5 border border-[#9E2226]/20 text-[#2A1D18] hover:border-[#9E2226] hover:text-[#9E2226] transition-all hover:-translate-y-0.5" dir="ltr">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#FAF8ED] p-8">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#9E2226] mb-5 flex items-center gap-2.5" dir="ltr">
                <span className="w-1.5 h-1.5 bg-[#9E2226] rounded-sm" />
                Tools & Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Git & GitHub", "Vercel", "Docker", "PostgreSQL", "Prisma ORM", "Redis", "Three.js", "React Three Fiber", "Blender", "GSAP"].map((tag) => (
                  <span key={tag} className="font-mono text-xs px-3 py-1.5 border border-[#9E2226]/20 text-[#2A1D18] hover:border-[#9E2226] hover:text-[#9E2226] transition-all hover:-translate-y-0.5" dir="ltr">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#FAF8ED] p-8">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#9E2226] mb-5 flex items-center gap-2.5" dir="ltr">
                <span className="w-1.5 h-1.5 bg-[#9E2226] rounded-sm" />
                Areas of Interest
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Artificial Intelligence", "Business Automation", "Digital Transformation", "SaaS Products", "Modern Web Experiences"].map((tag) => (
                  <span key={tag} className="font-mono text-xs px-3 py-1.5 border border-[#9E2226]/20 text-[#2A1D18] hover:border-[#9E2226] hover:text-[#9E2226] transition-all hover:-translate-y-0.5" dir="ltr">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SERVICES ===================== */}
      <section id="services" className="relative py-24 md:py-36 px-6 overflow-hidden">
        <ServicesCanvas />
        <div className="hidden md:block absolute top-8 right-6 md:right-12 z-10 font-mono text-xs text-[#1A120F]/40 tracking-wider" dir="ltr">
          03 / SERVICES
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="font-mono text-xs tracking-[0.14em] uppercase text-[#9E2226] flex items-center gap-3 mb-5" dir="ltr">
            <span className="w-6 h-px bg-[#9E2226]" />
            WHAT I OFFER
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#1A120F] leading-tight mb-12">
            خدمات تغطي رحلة المنتج الرقمي كاملة
          </h2>

          <div className="border-t border-[#9E2226]/20">
            {[
              { id: "01", text: "تصميم وتطوير مواقع الشركات والمؤسسات" },
              { id: "02", text: "بناء تطبيقات الويب والتطبيقات الإدارية" },
              { id: "03", text: "تصميم واجهات وتجارب المستخدم UI/UX" },
              { id: "04", text: "تطوير الأنظمة الرقمية وإدارة الأعمال" },
              { id: "05", text: "بناء الهوية الرقمية للعلامات التجارية" },
              { id: "06", text: "تحسين الأداء وتجربة المستخدم للمواقع والتطبيقات" },
            ].map((service) => (
              <div
                key={service.id}
                className="group flex items-center justify-between gap-6 py-6 border-b border-[#9E2226]/20 transition-all hover:pr-4 hover:text-[#9E2226] cursor-default"
              >
                <div className="flex items-center gap-6">
                  <span className="font-mono text-sm text-[#9E2226]" dir="ltr">{service.id}</span>
                  <span className="font-display font-medium text-lg sm:text-xl text-[#1A120F] group-hover:text-[#9E2226] transition-colors">
                    {service.text}
                  </span>
                </div>
                <span className="font-mono text-[#9E2226] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all rtl:rotate-180">
                  →
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== PROJECTS ===================== */}
      <section id="projects" className="relative py-24 md:py-36 px-6 bg-[#1A120F] text-[#FAF8ED] overflow-hidden">
        <ProjectsCanvas />
        <div className="hidden md:block absolute top-8 right-6 md:right-12 z-10 font-mono text-xs text-[#FAF8ED]/40 tracking-wider" dir="ltr">
          04 / SELECTED WORK
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="font-mono text-xs tracking-[0.14em] uppercase text-[#C7484C] flex items-center gap-3 mb-5" dir="ltr">
            <span className="w-6 h-px bg-[#C7484C]" />
            FEATURED PROJECTS
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#FAF8ED] leading-tight mb-12">
            أعمال مختارة
          </h2>

          <div className="grid gap-6">
            <div className="border border-[#FAF8ED]/10 p-8 sm:p-10 bg-[#1A120F]/60 backdrop-blur-sm hover:bg-[#9E2226]/10 transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <h3 className="font-display font-bold text-2xl text-[#FAF8ED]">شركة مدار وأفاق المحدودة</h3>
                <span className="font-mono text-xs text-[#C7484C]" dir="ltr">PRJ.01</span>
              </div>
              <p className="font-body text-base text-[#FAF8ED]/70 max-w-2xl mb-6 leading-relaxed">
                تصميم وتطوير موقع شركة احترافي يعكس الهوية التجارية والخدمات الاستثمارية والعقارية للشركة.
              </p>
              <div className="flex flex-wrap gap-2">
                {["UI/UX Design", "Web Development", "Digital Experience Design"].map((role) => (
                  <span key={role} className="font-mono text-xs px-3 py-1 border border-[#FAF8ED]/15 text-[#EDE8D6]" dir="ltr">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <div className="border border-[#FAF8ED]/10 p-8 sm:p-10 bg-[#1A120F]/60 backdrop-blur-sm hover:bg-[#9E2226]/10 transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <h3 className="font-display font-bold text-2xl text-[#FAF8ED]">شركة اتحاد البناء للمقاولات العامة</h3>
                <span className="font-mono text-xs text-[#C7484C]" dir="ltr">PRJ.02</span>
              </div>
              <p className="font-body text-base text-[#FAF8ED]/70 max-w-2xl mb-6 leading-relaxed">
                تطوير موقع شركة مقاولات حديث يركز على إبراز المشاريع والخدمات وبناء حضور رقمي احترافي.
              </p>
              <div className="flex flex-wrap gap-2">
                {["UI/UX Design", "Front-End Development"].map((role) => (
                  <span key={role} className="font-mono text-xs px-3 py-1 border border-[#FAF8ED]/15 text-[#EDE8D6]" dir="ltr">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <div className="border border-[#FAF8ED]/10 p-8 sm:p-10 bg-[#1A120F]/60 backdrop-blur-sm hover:bg-[#9E2226]/10 transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <h3 className="font-display font-bold text-2xl text-[#FAF8ED]">مديري (Mudiri)</h3>
                <span className="font-mono text-xs text-[#C7484C]" dir="ltr">PRJ.03</span>
              </div>
              <p className="font-body text-base text-[#FAF8ED]/70 max-w-2xl mb-6 leading-relaxed">
                نظام إداري ذكي يساعد المكاتب والإدارات على تنظيم الاجتماعات، المهام، المتابعات، والبيانات اليومية.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Product Design", "Flutter Development", "System Architecture"].map((role) => (
                  <span key={role} className="font-mono text-xs px-3 py-1 border border-[#FAF8ED]/15 text-[#EDE8D6]" dir="ltr">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== EDUCATION / VISION ===================== */}
      <section id="edu-vision" className="relative py-24 md:py-36 px-6 overflow-hidden">
        <div className="hidden md:block absolute top-8 right-6 md:right-12 z-10 font-mono text-xs text-[#1A120F]/40 tracking-wider" dir="ltr">
          05 / BACKGROUND
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_46px_1fr] gap-8 md:gap-12 items-stretch relative z-10">
          <div>
            <div className="font-mono text-xs tracking-[0.14em] uppercase text-[#9E2226] flex items-center gap-3 mb-5" dir="ltr">
              <span className="w-6 h-px bg-[#9E2226]" />
              EDUCATION
            </div>
            <div className="border border-[#9E2226]/20 p-8 bg-[#FAF8ED] shadow-sm h-full flex flex-col justify-center">
              <div className="font-display font-bold text-xl text-[#1A120F] mb-2" dir="ltr">
                University of Dhamar
              </div>
              <div className="font-body font-bold text-base text-[#2A1D18] mb-3">
                بكالوريوس تقنية المعلومات
              </div>
              <div className="font-mono text-sm text-[#9E2226]" dir="ltr">
                2022 — 2026
              </div>
            </div>
          </div>

          <EduVisionCanvas />

          <div>
            <div className="font-mono text-xs tracking-[0.14em] uppercase text-[#9E2226] flex items-center gap-3 mb-5" dir="ltr">
              <span className="w-6 h-px bg-[#9E2226]" />
              VISION
            </div>
            <div className="relative font-body text-lg text-[#2A1D18] leading-relaxed pt-6">
              <span className="font-display text-5xl text-[#9E2226] block leading-none mb-2" dir="ltr">“</span>
              أسعى إلى بناء منتجات تقنية مبتكرة تساعد الشركات والأفراد على الاستفادة من التكنولوجيا الحديثة، والمساهمة في تطوير مستقبل رقمي أكثر ذكاءً وكفاءة.
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER / CONTACT ===================== */}
      <footer id="contact" className="relative py-24 md:py-36 px-6 bg-[#1A120F] text-[#FAF8ED] overflow-hidden">
        <FooterCanvas />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="font-mono text-xs tracking-[0.14em] uppercase text-[#C7484C] flex items-center gap-3 mb-5" dir="ltr">
            <span className="w-6 h-px bg-[#C7484C]" />
            GET IN TOUCH
          </div>

          <h2 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-[#FAF8ED] leading-tight mb-4 ltr:text-left rtl:text-right" dir="ltr">
            Let's build<br />something.
          </h2>

          <p className="font-body text-base text-[#FAF8ED]/60 max-w-xl mb-10 leading-relaxed">
            جاهز لمناقشة فكرتك القادمة — من الهوية البصرية إلى المنتج الرقمي الكامل.
          </p>

          <div className="flex flex-wrap gap-3.5 mb-20">
            <a
              href="https://wa.me/967739008083"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs tracking-wider px-6 py-3.5 rounded bg-[#9E2226] text-[#FAF8ED] border border-[#9E2226] hover:bg-[#C7484C] hover:border-[#C7484C] transition-all hover:-translate-y-0.5 shadow-md"
              dir="ltr"
            >
              WhatsApp
            </a>
            <a
              href="tel:+967739008083"
              className="font-mono text-xs tracking-wider px-6 py-3.5 rounded text-[#FAF8ED] border border-[#FAF8ED]/35 hover:border-[#FAF8ED] transition-all hover:-translate-y-0.5"
              dir="ltr"
            >
              Call · +967 739 008 083
            </a>
            <a
              href="https://www.linkedin.com/in/rayash-albureihi-0ba32a404"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs tracking-wider px-6 py-3.5 rounded text-[#FAF8ED] border border-[#FAF8ED]/35 hover:border-[#FAF8ED] transition-all hover:-translate-y-0.5"
              dir="ltr"
            >
              LinkedIn
            </a>
            <a
              href="https://www.linkedin.com/in/rayash-albureihi-0ba32a404"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs tracking-wider px-6 py-3.5 rounded text-[#FAF8ED] border border-[#FAF8ED]/35 hover:border-[#FAF8ED] transition-all hover:-translate-y-0.5"
              dir="ltr"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com/0xo_0o"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs tracking-wider px-6 py-3.5 rounded text-[#FAF8ED] border border-[#FAF8ED]/35 hover:border-[#FAF8ED] transition-all hover:-translate-y-0.5"
              dir="ltr"
            >
              Instagram · @0xo_0o
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#FAF8ED]/10 font-mono text-xs text-[#FAF8ED]/45 tracking-wider">
            <span dir="ltr">© 2026 RAYASH FAISAL ALBUREIHI</span>
            <span dir="ltr">ENG.RAYASH — DESIGNER & IT ENGINEER</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
