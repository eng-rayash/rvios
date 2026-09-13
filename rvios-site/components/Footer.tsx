import Link from "next/link";
import Image from "next/image";
import { SERVICES } from "@/lib/services";

const COMPANY_LINKS = [
  { href: "/about", ar: "من نحن", en: "About" },
  { href: "/blog", ar: "مركز المعرفة", en: "Knowledge Center" },
  { href: "/contact", ar: "تواصل معنا", en: "Contact Us" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-ivory">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-12">

          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-3 group mb-5">
              <div className="relative w-9 h-9 shrink-0">
                <Image
                  src="/images/logo_icon.png"
                  alt="RVIOS"
                  fill
                  className="object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl tracking-[0.18em] text-ivory">RVIOS</span>
                <span className="font-body text-[0.6rem] tracking-[0.22em] text-ivory/50 uppercase">Technologies</span>
              </div>
            </Link>
            <p className="font-body text-sm leading-relaxed text-ivory/65 max-w-xs">
              نصمم ونطوّر مواقع ويب تنمو معها أعمالك.
            </p>
            <p className="font-body text-xs tracking-[0.15em] text-ivory/40 mt-1 uppercase">
              Custom websites that help businesses grow online.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <a
                href="mailto:info@rvios.com"
                className="flex items-center gap-3 font-body text-sm text-ivory/60 hover:text-ivory transition-colors group"
              >
                <span className="w-8 h-8 rounded-full bg-ivory/8 flex items-center justify-center group-hover:bg-primary/30 transition-colors shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                info@rvios.com
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/967739008083"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 font-body text-sm text-ivory/60 hover:text-ivory transition-colors group"
              >
                <span className="w-8 h-8 rounded-full bg-ivory/8 flex items-center justify-center group-hover:bg-green-900/50 transition-colors shrink-0">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </span>
                <span>واتساب خدمة العملاء</span>
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="md:col-span-4">
            <h4 className="font-body text-xs tracking-[0.25em] uppercase text-primary mb-5">
              الخدمات — Services
            </h4>
            <ul className="space-y-3">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="group flex flex-col hover:translate-x-[-4px] transition-transform duration-200"
                  >
                    <span className="font-body text-sm text-ivory/70 group-hover:text-ivory transition-colors">{s.nameAr}</span>
                    <span className="font-body text-[0.65rem] tracking-[0.15em] text-ivory/35 uppercase">{s.nameEn}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-4">
            <h4 className="font-body text-xs tracking-[0.25em] uppercase text-primary mb-5">
              المنصة — Platform
            </h4>
            <ul className="space-y-3 mb-8">
              {COMPANY_LINKS.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="group flex flex-col hover:translate-x-[-4px] transition-transform duration-200"
                  >
                    <span className="font-body text-sm text-ivory/70 group-hover:text-ivory transition-colors">{c.ar}</span>
                    <span className="font-body text-[0.65rem] tracking-[0.15em] text-ivory/35 uppercase">{c.en}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary text-ivory rounded-full px-5 py-2.5 font-body text-sm font-bold hover:bg-primary-dark transition-all duration-300 hover:shadow-red-glow"
            >
              ابدأ مشروعك
              <svg className="w-3.5 h-3.5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-ivory/8">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col items-center justify-between gap-3 md:flex-row">
          <span className="font-body text-xs text-ivory/35">
            © {year} RVIOS Technologies. جميع الحقوق محفوظة. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <a
              href="/rayash"
              className="font-body text-xs text-ivory/30 hover:text-ivory/60 transition-colors"
            >
              Created by{" "}
              <span className="text-primary/70 hover:text-primary font-bold transition-colors">
                Rayash
              </span>
            </a>
            <span className="font-body text-xs tracking-[0.15em] text-ivory/20 uppercase">
              rvios.com
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
