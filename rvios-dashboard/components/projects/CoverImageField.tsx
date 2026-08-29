"use client";
import { useRef, useState } from "react";
import { ImageOff, Upload } from "lucide-react";
import { uploadToR2 } from "@/lib/upload";
import { Input } from "@/components/ui/Field";

/**
 * صورة الغلاف — رفعٌ مباشر أو لصق رابط.
 *
 * بوّابة النشر تشترط غلافاً، وكان الحقل نصّاً وحده: على المحرّر أن يرفع
 * في تبويب المعرض ثم ينسخ الرابط ويعود. الرفع من مكانه يقصّر الطريق،
 * والمعاينة تكشف الرابط المكسور قبل النشر لا بعده.
 */
export function CoverImageField({
  token,
  url,
  alt,
  onUrlChange,
  onAltChange,
}: {
  token: string;
  url: string;
  alt: string;
  onUrlChange: (v: string) => void;
  onAltChange: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pct, setPct] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [broken, setBroken] = useState(false);

  async function upload(file: File) {
    setError(null);
    setPct(0);
    try {
      const img = await uploadToR2(token, file, setPct);
      setBroken(false);
      onUrlChange(img.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر الرفع");
    } finally {
      setPct(null);
    }
  }

  return (
    <div className="grid gap-4 rounded-sm border border-border-default p-4">
      <div className="flex items-start gap-4">
        <div className="grid h-24 w-32 shrink-0 place-items-center overflow-hidden rounded-sm border border-border-default bg-surface-2">
          {url && !broken ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={url}
              alt={alt}
              onError={() => setBroken(true)}
              onLoad={() => setBroken(false)}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageOff size={20} aria-hidden className="text-fg-muted" />
          )}
        </div>

        <div className="grid flex-1 gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={pct !== null}
            className="inline-flex w-fit items-center gap-2 rounded-sm border border-border-strong px-4 py-2 text-sm transition-fast hover:border-primary-500 hover:text-primary-500 disabled:opacity-50"
          >
            <Upload size={14} aria-hidden />
            {pct !== null ? `جارٍ الرفع… ${pct}%` : url ? "استبدال الغلاف" : "رفع غلاف"}
          </button>
          <p className="font-mono text-[11px] text-fg-muted">
            JPEG · PNG · WebP · AVIF — حتى ٢٠ ميغابايت
          </p>
          {url && broken && (
            <p role="alert" className="text-xs text-warning">
              الرابط لا يعرض صورة — تحقّق من تفعيل الوصول العام على دلو R2
            </p>
          )}
          {error && (
            <p role="alert" className="text-xs text-danger">{error}</p>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <Input
        label="رابط صورة الغلاف"
        hint="يُملأ تلقائياً بعد الرفع — أو الصق رابطاً"
        value={url}
        onChange={(e) => { setBroken(false); onUrlChange(e.target.value); }}
      />
      <Input
        label="وصف صورة الغلاف"
        hint="نصّ بديل لقارئات الشاشة ومحرّكات البحث"
        value={alt}
        onChange={(e) => onAltChange(e.target.value)}
      />
    </div>
  );
}
