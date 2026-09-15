"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import SpecularButton from "@/components/SpecularButton";

const NAV = [
  { href: "/", ar: "الرئيسية", en: "Home" },
  { href: "/services", ar: "خدماتنا", en: "Services" },
  { href: "/work", ar: "أعمالنا", en: "Work" },
  { href: "/blog", ar: "مركز المعرفة", en: "Blog" },
  { href: "/about", ar: "من نحن", en: "About" },
  { href: "/contact", ar: "تواصل", en: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-3"
          }`}
      >
        <div
          className={`mx-4 flex items-center justify-between rounded-2xl px-5 transition-all duration-500 ${scrolled
            ? "bg-black/65 shadow-2xl backdrop-blur-xl border border-white/10 py-3"
            : "bg-black/35 backdrop-blur-md border border-white/10 py-3"
            } md:mx-8`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setMenuOpen(false)}>
            <div className="relative w-8 h-8 shrink-0">
              <Image
                src="/images/logo_icon.png"
                alt="RVIOS"
                fill
                className="object-contain transition-transform duration-500 group-hover:rotate-6"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg tracking-[0.18em] text-ivory">RVIOS</span>
              <span className="font-body text-[0.55rem] tracking-[0.22em] text-ivory/60 uppercase">Technologies</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex flex-col items-center px-4 py-2 rounded-xl transition-colors hover:bg-white/10"
              >
                <span className="font-subhead text-sm font-bold text-ivory/90 transition-colors group-hover:text-primary">
                  {item.ar}
                </span>
                <span className="font-body text-[0.6rem] tracking-[0.18em] text-ivory/50 uppercase transition-colors group-hover:text-primary/80">
                  {item.en}
                </span>
              </Link>
            ))}
          </nav>

          {/* Header CTA with Specular animation */}
          <div className="flex items-center gap-3">
            <Link href="/contact" className="inline-flex">
              <SpecularButton
                size="sm"
                radius={16}
                lineColor="#EF4444"
                baseColor="#80000A"
                tint="#80000A"
                tintOpacity={0.85}
                textColor="#ffffff"
                intensity={1.2}
                shineSize={12}
                shineFade={35}
                thickness={1.5}
                followMouse={true}
                proximity={200}
                className="!px-3.5 !py-2 sm:!px-5 sm:!py-2.5"
              >
                <span className="font-bold text-xs sm:text-sm text-white">ابدأ مشروعك</span>
                <span className="hidden sm:inline text-[#F87171] font-bold text-[0.65rem] tracking-wider uppercase">START A PROJECT</span>
              </SpecularButton>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            id="mobile-menu-toggle"
            className="flex md:hidden flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-xl hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-0.5 bg-ivory rounded-full transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""
                }`}
            />
            <span
              className={`block w-5 h-0.5 bg-ivory rounded-full transition-all duration-300 ${menuOpen ? "opacity-0" : ""
                }`}
            />
            <span
              className={`block w-5 h-0.5 bg-ivory rounded-full transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-400 ${menuOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setMenuOpen(false)}
        />
        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 w-72 h-full bg-white shadow-2xl transition-transform duration-400 ease-out ${menuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex flex-col h-full pt-24 pb-8 px-6">
            <nav className="flex flex-col gap-2 flex-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between py-4 border-b border-black/5 group"
                  onClick={() => setMenuOpen(false)}
                >
                  <div>
                    <span className="block font-body text-base font-bold text-ink group-hover:text-primary transition-colors">
                      {item.ar}
                    </span>
                    <span className="block font-body text-xs tracking-[0.18em] text-ink-faint uppercase mt-0.5">
                      {item.en}
                    </span>
                  </div>
                  <svg className="w-4 h-4 text-ink-faint group-hover:text-primary transition-colors rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </nav>

            <Link
              href="/contact"
              className="btn-primary justify-center text-center mt-6"
              onClick={() => setMenuOpen(false)}
            >
              ابدأ مشروعك — Start a Project
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
