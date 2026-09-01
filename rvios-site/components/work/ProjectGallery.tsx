"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ProjectImage } from "@/lib/api/types";

/**
 * معرض صور المشروع مع lightbox.
 *
 * يستعمل `<dialog>` الأصلي: يوفّر حبس التركيز وإغلاق Escape ووضع الـ top-layer
 * بلا مكتبة ولا مصائد تركيز يدوية.
 */
export function ProjectGallery({ images }: { images: ProjectImage[] }) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const close = useCallback(() => {
    dialogRef.current?.close();
    setOpenAt(null);
  }, []);

  const move = useCallback(
    (delta: number) => {
      setOpenAt((i) =>
        i === null ? i : (i + delta + images.length) % images.length,
      );
    },
    [images.length],
  );

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (openAt !== null && !d.open) d.showModal();
  }, [openAt]);

  useEffect(() => {
    if (openAt === null) return;
    const onKey = (e: KeyboardEvent) => {
      /* في RTL السهم الأيسر يتقدّم — اتجاه القراءة لا اتجاه المحور */
      if (e.key === "ArrowLeft") { e.preventDefault(); move(1); }
      if (e.key === "ArrowRight") { e.preventDefault(); move(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openAt, move]);

  if (!images.length) return null;
  const current = openAt === null ? null : images[openAt];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setOpenAt(i)}
            aria-label={`تكبير الصورة ${i + 1} من ${images.length}`}
            className="group relative block aspect-[16/10] overflow-hidden border border-border bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
          >
            <Image
              src={img.url}
              alt={img.alt ?? ""}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 100vw, 50vw"
              placeholder={img.blurHash ? "blur" : "empty"}
              blurDataURL={img.blurHash ?? undefined}
              className="object-cover transition-transform duration-slow ease-out group-hover:scale-[1.03]"
            />
            {img.caption && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-4 text-start text-sm text-ivory">
                {img.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setOpenAt(null)}
        /* النقر على الخلفية يغلق — الحدث يصل من العنصر نفسه لا من المحتوى */
        onClick={(e) => { if (e.target === dialogRef.current) close(); }}
        className="max-h-[92vh] max-w-[92vw] bg-transparent p-0 backdrop:bg-ink/90"
      >
        {current && (
          <figure className="relative m-0">
            <Image
              src={current.url}
              alt={current.alt ?? ""}
              width={current.width ?? 1600}
              height={current.height ?? 1000}
              className="max-h-[80vh] w-auto object-contain"
            />
            <figcaption className="mt-3 flex items-center justify-between gap-4 font-mono text-xs text-ivory/70">
              <span>{current.caption}</span>
              <span className="tabular-nums">
                {openAt! + 1} / {images.length}
              </span>
            </figcaption>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => move(-1)}
                  aria-label="الصورة السابقة"
                  className="absolute end-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border border-gold/40 bg-ink/70 text-ivory transition-all duration-fast hover:border-gold hover:text-gold"
                >
                  →
                </button>
                <button
                  type="button"
                  onClick={() => move(1)}
                  aria-label="الصورة التالية"
                  className="absolute start-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border border-gold/40 bg-ink/70 text-ivory transition-all duration-fast hover:border-gold hover:text-gold"
                >
                  ←
                </button>
              </>
            )}

            <button
              type="button"
              onClick={close}
              aria-label="إغلاق"
              className="absolute -top-10 start-0 font-mono text-sm text-ivory/70 hover:text-gold"
            >
              إغلاق ×
            </button>
          </figure>
        )}
      </dialog>
    </>
  );
}
