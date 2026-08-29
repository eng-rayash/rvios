"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* قفل تمرير الجسم أثناء فتح قائمة الهاتف */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  /* التنقّل يغلق القائمة: بدونه تبقى مفتوحة فوق الصفحة الجديدة */
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  /* Escape يغلق — قاعدة أي طبقة فوقية */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-sticky transition-all duration-base ease-out ${
          scrolled
            ? "border-b border-border-subtle bg-surface-0/85 py-3 backdrop-blur-xl"
            : "border-b border-transparent py-5"
        }`}
      >
        <div className="mx-auto flex w-[min(100%-3rem,1200px)] items-center justify-between gap-6">
          {/* الشعار */}
          <Link href="/" className="group flex items-center gap-3">
            <span className="relative h-8 w-8 shrink-0">
              <Image
                src="/images/logo_icon.png"
                alt=""
                fill
                className="object-contain transition-transform duration-slow ease-out group-hover:rotate-6"
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg tracking-[0.18em] text-fg">RVIOS</span>
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.22em] text-fg-muted">
                Technologies
              </span>
            </span>
          </Link>

          {/* تنقّل سطح المكتب */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`group relative px-4 py-2 font-body text-sm transition-colors duration-fast ${
                  isActive(item.href) ? "text-gold" : "text-fg-muted hover:text-fg"
                }`}
              >
                {item.ar}
                {/* شعيرة تحت العنصر النشط وعند التحويم — لا خلفية ولا حبّة */}
                <span
                  aria-hidden
                  className={`absolute inset-x-3 bottom-0 h-px origin-right bg-gold transition-transform duration-base ease-out ${
                    isActive(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/contact" className="btn-primary hidden text-xs sm:inline-flex">
              ابدأ مشروعك
            </Link>

            {/* زرّ قائمة الهاتف */}
            <button
              type="button"
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            >
              <span
                className={`block h-0.5 w-5 bg-fg transition-transform duration-base ease-out ${
                  menuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-fg transition-opacity duration-base ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-fg transition-transform duration-base ease-out ${
                  menuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* طبقة قائمة الهاتف */}
      <div
        className={`fixed inset-0 z-overlay md:hidden ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-surface-0/70 backdrop-blur-sm transition-opacity duration-base ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />
        <nav
          id="mobile-nav"
          aria-hidden={!menuOpen}
          className={`absolute inset-y-0 end-0 flex w-72 flex-col border-s border-border-default bg-surface-1 px-6 pb-8 pt-24 transition-transform duration-base ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-1 flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                /* خارج ترتيب التبويب وهي مغلقة: بدونه يتنقّل التركيز إلى
                   روابط لا يراها أحد خلف الطبقة */
                tabIndex={menuOpen ? undefined : -1}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="group flex items-center justify-between border-b border-border-subtle py-4"
              >
                <span>
                  <span
                    className={`block font-body text-base font-bold transition-colors ${
                      isActive(item.href) ? "text-gold" : "text-fg group-hover:text-gold"
                    }`}
                  >
                    {item.ar}
                  </span>
                  <span className="mt-0.5 block font-mono text-xs uppercase tracking-[0.18em] text-fg-muted">
                    {item.en}
                  </span>
                </span>
                <span aria-hidden className="font-mono text-fg-muted group-hover:text-gold">
                  ←
                </span>
              </Link>
            ))}
          </div>

          <Link
            href="/contact"
            tabIndex={menuOpen ? undefined : -1}
            className="btn-primary mt-6 justify-center"
          >
            ابدأ مشروعك
          </Link>
        </nav>
      </div>
    </>
  );
}
