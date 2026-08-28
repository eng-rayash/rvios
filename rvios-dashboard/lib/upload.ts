import { mediaApi } from "./api";
import type { PresignResult } from "./types";

/** ما يقبله الخادم (`rvios-api/src/media/allowed-mime.ts`). */
const ALLOWED = [
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/avif",
] as const;

const MAX_SIZE = 20 * 1024 * 1024; // 20MB — يطابق حدّ الخادم

export interface UploadedImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

/**
 * يرفع ملفاً إلى R2 عبر رابط موقّع.
 *
 * الملف يذهب من المتصفح إلى R2 مباشرة ولا يمرّ عبر الـ API إطلاقاً:
 * لا حدّ لحجم الطلب على الخادم، ولا ذاكرة مستهلكة، ولا زمن انتظار.
 */
export async function uploadToR2(
  token: string,
  file: File,
  onProgress?: (pct: number) => void,
): Promise<UploadedImage> {
  if (!(ALLOWED as readonly string[]).includes(file.type)) {
    throw new Error(`نوع الملف غير مدعوم: ${file.type || "غير معروف"}`);
  }
  if (file.size > MAX_SIZE) {
    throw new Error(`الملف أكبر من ٢٠ ميغابايت (${(file.size / 1048576).toFixed(1)}MB)`);
  }

  const { uploadUrl, publicUrl }: PresignResult = await mediaApi.presign(
    token,
    file.name,
    file.type,
  );

  /* XHR لا fetch: هو الوحيد الذي يعطي تقدّم الرفع. */
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error(`فشل الرفع إلى التخزين (${xhr.status})`));
    xhr.onerror = () => reject(new Error("انقطع الاتصال أثناء الرفع"));
    xhr.send(file);
  });

  const { width, height } = await readDimensions(file);
  return { url: publicUrl, width, height, alt: "" };
}

/**
 * أبعاد الصورة تُقرأ في المتصفح قبل الحفظ.
 * تخزينها يمنع قفزة التخطيط في `next/image` على الموقع.
 */
function readDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: 0, height: 0 }); // لا نُفشل الرفع لأجل الأبعاد
    };
    img.src = url;
  });
}

/** رفع متوازٍ بحدّ ٣ — أسرع من التسلسل وأرحم على الشبكة من دفعة واحدة. */
export async function uploadMany(
  token: string,
  files: File[],
  onItem: (index: number, pct: number) => void,
): Promise<{ uploaded: UploadedImage[]; errors: { name: string; message: string }[] }> {
  const uploaded: UploadedImage[] = [];
  const errors: { name: string; message: string }[] = [];
  let cursor = 0;

  const worker = async () => {
    while (cursor < files.length) {
      const i = cursor++;
      try {
        uploaded.push(await uploadToR2(token, files[i], (p) => onItem(i, p)));
      } catch (e) {
        errors.push({
          name: files[i].name,
          message: e instanceof Error ? e.message : "فشل غير معروف",
        });
      }
    }
  };

  await Promise.all(Array.from({ length: Math.min(3, files.length) }, worker));
  return { uploaded, errors };
}
