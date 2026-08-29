"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/** هل يفضّل المستخدم تقليل الحركة؟ يُقرأ في المتصفح لا أثناء الرندر. */
function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/* ══════════════════════════════════════════════════════════════
   شريط تقدّم القراءة
   ══════════════════════════════════════════════════════════════ */

/**
 * خيط عنّابي أعلى الشاشة يتبع نسبة التمرير.
 *
 * `scaleX` على عنصر ثابت — لا `width` ولا `left`: هذان يُعيدان التخطيط
 * في كل إطار تمرير، والتحويل لا يُعيد إلا التركيب.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      /* صفحة أقصر من الشاشة: لا تقدّم تُقاس، والقسمة على صفر تعطي NaN */
      el.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };

    /* rAF واحد معلّق كحدّ أقصى: التمرير يُطلق عشرات الأحداث في الإطار */
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-sticky h-px"
    >
      <div
        ref={ref}
        className="h-full origin-right bg-primary"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   حدّ متوهّج يتبع المؤشّر
   ══════════════════════════════════════════════════════════════ */

/**
 * يكتب موضع المؤشّر في `--mx`/`--my`، و`.glow-card` في `globals.css`
 * يرسم منه تدرّجاً شعاعياً.
 *
 * بديل `SpecularButton` المحذوف: ذاك كان يرسم على WebGL بألوان مكتوبة
 * يدوياً؛ هذا خاصيّتان مخصّصتان وتدرّج CSS واحد.
 */
export function GlowCard({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    /* pointer لا mouse: يغطّي الفأرة والقلم. اللمس لا يُطلق `pointermove`
       قبل اللمس فعلاً، والقيم الافتراضية تُبقي التوهّج مطفأً حتى حينها. */
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };

    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Tag ref={ref as never} className={`glow-card ${className}`}>
      {children}
    </Tag>
  );
}

/* ══════════════════════════════════════════════════════════════
   الشعيرة الذهبية التي تُرسم عند الدخول
   ══════════════════════════════════════════════════════════════ */

/** خط ذهبي يمتدّ من اليمين عند دخوله الشاشة — توقيع الأقسام المتكرر. */
export function DrawRule({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  /* يبدأ مرسوماً على الخادم: لو لم يعمل JS تبقى الشعيرة ظاهرة لا معدومة */
  const [drawn, setDrawn] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const box = el.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) return; // ظاهر أصلاً

    setDrawn(false);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      style={style}
      className={`rule-draw ${drawn ? "is-in" : ""} ${className}`}
    />
  );
}
