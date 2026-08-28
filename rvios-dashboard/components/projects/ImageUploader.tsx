"use client";
import { useRef, useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { projectsApi } from "@/lib/api";
import { uploadMany } from "@/lib/upload";
import type { ProjectImage } from "@/lib/types";

/**
 * رفع صور المعرض.
 *
 * المسار: `presign` من الـ API → رفع مباشر بـ PUT إلى R2 → تسجيل الروابط.
 * الملف لا يمرّ عبر الـ API إطلاقاً.
 */
export function ImageUploader({
  token,
  projectId,
  images,
  onChange,
}: {
  token: string;
  projectId: string;
  images: ProjectImage[];
  onChange: (imgs: ProjectImage[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<Record<number, number>>({});
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  async function handleFiles(files: FileList | File[]) {
    const list = Array.from(files);
    if (!list.length) return;

    setBusy(true);
    setErrors([]);
    setProgress({});

    const { uploaded, errors: failed } = await uploadMany(token, list, (i, pct) =>
      setProgress((p) => ({ ...p, [i]: pct })),
    );

    if (failed.length) setErrors(failed.map((f) => `${f.name}: ${f.message}`));

    if (uploaded.length) {
      try {
        const saved = await projectsApi.addImages(token, projectId, uploaded);
        onChange(saved);
      } catch (e) {
        /* الصور رُفعت إلى R2 لكن لم تُسجَّل — نُعلم المستخدم بدل ابتلاع
           الحالة، فالملفات موجودة والسجلّ ناقص. */
        setErrors((prev) => [
          ...prev,
          e instanceof Error ? e.message : "رُفعت الصور ولم تُسجَّل — أعد المحاولة",
        ]);
      }
    }

    setBusy(false);
    setProgress({});
  }

  async function removeImage(img: ProjectImage) {
    if (!confirm("حذف هذه الصورة؟")) return;
    try {
      await projectsApi.deleteImage(token, img.id);
      onChange(images.filter((i) => i.id !== img.id));
    } catch (e) {
      setErrors([e instanceof Error ? e.message : "تعذّر الحذف"]);
    }
  }

  const pcts = Object.values(progress);
  const overall = pcts.length
    ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length)
    : 0;

  return (
    <div className="grid gap-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`grid place-items-center gap-3 rounded-sm border-2 border-dashed p-10 text-center transition-fast ${
          dragOver ? "border-primary-500 bg-primary-50" : "border-border-strong"
        }`}
      >
        <Upload size={22} aria-hidden className="text-fg-muted" />
        <p className="text-sm text-fg-muted">
          أفلت الصور هنا، أو
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mx-1 text-primary-500 underline-offset-4 hover:underline"
          >
            اخترها
          </button>
        </p>
        <p className="font-mono text-[11px] text-fg-muted">
          JPEG · PNG · WebP · AVIF — حتى ٢٠ ميغابايت للملف
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="sr-only"
          onChange={(e) => { handleFiles(e.target.files ?? []); e.target.value = ""; }}
        />
      </div>

      {busy && (
        <div>
          <div className="h-1 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full bg-primary-500 transition-[width] duration-base"
              style={{ width: `${overall}%` }}
            />
          </div>
          <p className="mt-2 font-mono text-xs text-fg-muted">جارٍ الرفع… {overall}%</p>
        </div>
      )}

      {errors.length > 0 && (
        <ul role="alert" className="rounded-sm border border-danger bg-danger/5 p-3 text-xs text-danger">
          {errors.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      )}

      {images.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((img) => (
            <li
              key={img.id}
              className="group relative overflow-hidden rounded-sm border border-border-default"
            >
              {/* صور R2 من نطاقات متعدّدة؛ `<img>` هنا أبسط من ضبط
                  remotePatterns للوحة، والصور خلف المصادقة */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt ?? ""}
                className="aspect-[4/3] w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(img)}
                aria-label="حذف الصورة"
                className="absolute end-2 top-2 grid h-8 w-8 place-items-center rounded-sm bg-surface-3/90 text-danger opacity-0 transition-fast focus-visible:opacity-100 group-hover:opacity-100"
              >
                <Trash2 size={14} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
