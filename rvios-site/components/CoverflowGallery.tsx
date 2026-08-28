"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import styles from "./CoverflowGallery.module.css";

/* ثوابت الهندسة — غير معروضة كخصائص لأن تغييرها يكسر التناسق البصري */
const PERSPECTIVE_DEPTH = 240; // كم تتراجع كل درجة ابتعاد للخلف
const SCALE_STEP = 0.13;       // كم تتقلّص كل درجة ابتعاد
const MAX_VISIBLE = 2;         // عدد البطاقات الظاهرة على كل جانب

export interface CoverflowItem {
  /** يُستخدم كمفتاح React ولبناء الرابط */
  slug: string;
  title: string;
  /** يظهر في السطر العلوي من التعليق، مثل: «مجموعة نُهى» */
  client?: string;
  year?: number | string;
  /** سطر النتيجة تحت العنوان، مثل: «٣٢٪ انخفاض في تكلفة المخزون» */
  summary?: string;
  imageUrl?: string;
  imageAlt?: string;
  /** placeholder فوري إن توفّر من قاعدة البيانات */
  blurDataURL?: string;
}

export interface CoverflowGalleryProps {
  items: CoverflowItem[];
  eyebrow?: string;
  heading?: string;
  /** المسافة الأفقية بين البطاقات بالبكسل */
  gap?: number;
  /** دوران رأسي لكل درجة ابتعاد (بالدرجات) */
  tilt?: number;
  /** ميل جانبي طفيف لكل درجة ابتعاد (بالدرجات) */
  sideTilt?: number;
  /** عتامة الحجاب على البطاقات غير الفعّالة، 0–1 */
  dim?: number;
  /** فاصل التقدّم التلقائي بالمللي ثانية. 0 = معطّل */
  autoplayMs?: number;
  /** يُستدعى عند تفعيل بطاقة فعّالة أصلاً — للتنقّل إلى صفحة المشروع */
  onOpen?: (item: CoverflowItem) => void;
}

/** ٣ → «٠٣» بالأرقام العربية الهندية */
const toArabicPadded = (n: number) =>
  String(n)
    .padStart(2, "0")
    .replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);

/**
 * عارض أعمال ثلاثي الأبعاد بلغة «أرشيف ملكي».
 *
 * البطاقة الفعّالة منتصبة في الضوء، والجاراتُ تتراجع بمنظور خلفها.
 * يدعم النقر والأسهم والسحب باللمس، ويحترم `prefers-reduced-motion`.
 */
export default function CoverflowGallery({
  items,
  eyebrow = "مختارات",
  heading = "أعمال بارزة",
  gap = 200,
  tilt = 12,
  sideTilt = 4,
  dim = 0.55,
  autoplayMs = 0,
  onOpen,
}: CoverflowGalleryProps) {
  const n = items.length;
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);
  const lockedUntil = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [paused, setPaused] = useState(false);
  const labelId = useId();

  /* لا نقرأ prefers-reduced-motion أثناء الرندر: القيمة غير متاحة على
     الخادم، وقراءتها في useEffect تُبقي HTML الخادم والعميل متطابقين. */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* إن قصرت القائمة فجأة، أبقِ المؤشر داخل النطاق */
  useEffect(() => {
    setActive((a) => (n === 0 ? 0 : Math.min(a, n - 1)));
  }, [n]);

  const go = useCallback(
    (index: number) => {
      if (n === 0) return;
      /* قفل زمني يمنع تكدّس النقرات السريعة فوق بعضها */
      if (!reduced && performance.now() < lockedUntil.current) return;
      const next = ((index % n) + n) % n;
      setActive((prev) => {
        if (prev === next) return prev;
        if (!reduced) lockedUntil.current = performance.now() + 620;
        return next;
      });
    },
    [n, reduced],
  );

  const step = useCallback((dir: number) => go(active + dir), [go, active]);

  const handleCardClick = useCallback(
    (index: number, item: CoverflowItem) => {
      if (index === active) onOpen?.(item);
      else go(index);
    },
    [active, go, onOpen],
  );

  /* في RTL السهم الأيسر يتقدّم — نتبع اتجاه القراءة لا اتجاه المحور */
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":  e.preventDefault(); step(1); break;
        case "ArrowRight": e.preventDefault(); step(-1); break;
        case "Home":       e.preventDefault(); go(0); break;
        case "End":        e.preventDefault(); go(n - 1); break;
      }
    },
    [step, go, n],
  );

  useEffect(() => {
    if (!autoplayMs || reduced || paused || n < 2) return;
    const id = window.setInterval(() => step(1), autoplayMs);
    return () => window.clearInterval(id);
  }, [autoplayMs, reduced, paused, n, step]);

  /* أوقف التقدّم التلقائي عند إخفاء التبويب — لا فائدة من تحريك ما لا يُرى */
  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 45) step(dx > 0 ? -1 : 1);
    touchStartX.current = null;
  };

  /* الوضع الهندسي لكل بطاقة — يُعاد حسابه فقط عند تغيّر المؤشر أو الإعدادات */
  const placements = useMemo(
    () =>
      items.map((_, i) => {
        /* المسافة الدائرية الأقصر: تجعل الالتفاف من آخر عنصر إلى أوله غير مرئي */
        let rel = i - active;
        if (rel > n / 2) rel -= n;
        if (rel < -n / 2) rel += n;

        const dist = Math.abs(rel);
        const visible = dist <= MAX_VISIBLE;

        return {
          rel,
          visible,
          isActive: rel === 0,
          /* الموجب يذهب يساراً: الشريط يتقدّم مع اتجاه القراءة العربي */
          transform:
            `translate(-50%, -50%) translateX(${-rel * gap}px) ` +
            `translateZ(${-dist * PERSPECTIVE_DEPTH}px) ` +
            `rotateY(${rel * tilt}deg) rotateZ(${-rel * sideTilt}deg) ` +
            `scale(${Math.max(0.4, 1 - dist * SCALE_STEP)})`,
        };
      }),
    [items, active, n, gap, tilt, sideTilt],
  );

  if (n === 0) return null;

  return (
    <section
      className={styles.wrap}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className={styles.head}>
        <div>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h2 id={labelId}>{heading}</h2>
        </div>
        <span className={styles.counter}>
          {toArabicPadded(active + 1)} / {toArabicPadded(n)}
        </span>
      </div>

      <div
        ref={stageRef}
        className={styles.stage}
        tabIndex={0}
        role="group"
        aria-roledescription="عارض"
        aria-labelledby={labelId}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className={styles.track}>
          {items.map((item, i) => {
            const p = placements[i];
            return (
              <button
                key={item.slug}
                type="button"
                className={`${styles.card} ${p.isActive ? styles.isActive : ""}`}
                style={{
                  transform: p.transform,
                  opacity: p.visible ? 1 : 0,
                  pointerEvents: p.visible ? "auto" : "none",
                }}
                /* البطاقات المخفية تخرج من ترتيب التبويب حتى لا يعلق التنقّل بها */
                tabIndex={p.visible ? 0 : -1}
                aria-hidden={!p.visible}
                aria-current={p.isActive ? "true" : undefined}
                onClick={() => handleCardClick(i, item)}
              >
                <div className={styles.media}>
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.imageAlt ?? item.title}
                      fill
                      /* البطاقة الفعّالة فقط تُحمَّل بأولوية؛ الباقي كسول */
                      priority={p.isActive}
                      loading={p.isActive ? undefined : "lazy"}
                      sizes="(max-width: 860px) 84vw, 560px"
                      placeholder={item.blurDataURL ? "blur" : "empty"}
                      blurDataURL={item.blurDataURL}
                      draggable={false}
                      style={{ objectFit: "cover" }}
                    />
                  ) : null}
                </div>

                <div className={styles.caption}>
                  <span className={styles.meta}>
                    {[item.client, item.year].filter(Boolean).join(" · ")}
                  </span>
                  <h3>{item.title}</h3>
                  {item.summary ? <p>{item.summary}</p> : null}
                </div>

                <div
                  className={styles.veil}
                  style={{ opacity: p.isActive ? 0 : dim }}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => step(-1)}
          aria-label="العمل السابق"
        >
          ←
        </button>
        <div className={styles.dots}>
          {items.map((item, i) => (
            <button
              key={item.slug}
              type="button"
              className={`${styles.dot} ${i === active ? styles.dotOn : ""}`}
              aria-label={`الانتقال إلى ${item.title}`}
              aria-current={i === active ? "true" : "false"}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => step(1)}
          aria-label="العمل التالي"
        >
          →
        </button>
      </div>

      <p className={styles.srOnly} aria-live="polite">
        {`${active + 1} من ${n}: ${items[active].title}`}
      </p>
    </section>
  );
}
