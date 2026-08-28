"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * دخول عند التقاطع.
 *
 * المدى متقشّف عمداً: المقترح المعتمد لا يحوي ولا `@keyframes` واحداً، وأقصى
 * حركة فيه `translateY(-3px)`. أي دخول أعرض من هذا يخالف روح الاتجاه — ولذلك
 * لا GSAP هنا ولا ScrollTrigger.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  /** تأخير بالمللي ثانية — للتدرّج داخل شبكة */
  delay?: number;
  as?: "div" | "li" | "article" | "section";
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  /**
   * ثلاث حالات:
   *   `null`  — قبل التركيب: يُعرض ظاهراً. هذا ما يُرسَل في HTML الخادم،
   *             فلا يختفي المحتوى إن تعطّل JS أو فشل IntersectionObserver.
   *   `false` — مخفيّ بانتظار الدخول (أسفل الطيّة فقط).
   *   `true`  — ظاهر.
   */
  const [hidden, setHidden] = useState<boolean | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* التفضيل يُقرأ هنا لا أثناء الرندر: غير متاح على الخادم، وقراءته في
       الرندر تُنتج HTML مختلفاً بين الخادم والعميل. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* ما هو داخل الشاشة عند التحميل يُعرض فوراً بلا حركة: إخفاؤه ثم إظهاره
       يؤخّر أكبر عنصر مرئي (LCP) بلا مقابل. */
    const box = el.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) return;

    setHidden(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHidden(false);
          io.disconnect(); // مرة واحدة — لا نُخفيه عند الخروج
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={className}
      style={
        hidden === null
          ? undefined
          : {
              opacity: hidden ? 0 : 1,
              transform: hidden ? "translateY(12px)" : "none",
              transition: `opacity var(--motion-slow,600ms) var(--ease-out,cubic-bezier(.16,1,.3,1)) ${delay}ms, transform var(--motion-slow,600ms) var(--ease-out,cubic-bezier(.16,1,.3,1)) ${delay}ms`,
            }
      }
    >
      {children}
    </Tag>
  );
}

/** عدّاد تصاعدي — للأرقام الإجمالية. يحترم تقليل الحركة. */
export function CountUp({
  to,
  suffix = "",
  duration = 1400,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  /* يبدأ بالقيمة النهائية عمداً — فهي ما يُرسَل في HTML الخادم وما يبقى
     ظاهراً إن لم تعمل الحركة (تبويب خلفي، لوح لا يركّب إطارات، JS معطّل).
     البدء من صفر كان يترك «٠ مشروعاً» معروضاً في تلك الحالات. */
  const [n, setN] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();

      let raf = 0;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        /* نفس منحنى --ease-out المعتمد */
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      /* شبكة أمان: إن توقّف rAF في المنتصف، تُضبط القيمة النهائية بدل
         تجمّد العدّاد عند رقم عشوائي. */
      const settle = window.setTimeout(() => {
        cancelAnimationFrame(raf);
        setN(to);
      }, duration + 400);

      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(settle);
      };
    }, { threshold: 0.3 });

    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}
