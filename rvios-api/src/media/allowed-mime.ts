/**
 * Upload allow-list, shared by the multipart fileFilter and the presign DTO.
 *
 * `image/svg+xml` is deliberately excluded: SVG can carry inline script, and
 * these files are served from a public bucket.
 */
export const ALLOWED_MIME = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'video/mp4',
  'video/webm',
  'application/pdf',
] as const satisfies readonly string[];

export const MAX_UPLOAD_SIZE = 20 * 1024 * 1024; // 20MB

/**
 * الامتداد يُشتقّ من النوع لا من اسم الملف الأصلي.
 *
 * `originalname.split('.').pop()` يرجّع الاسم كاملاً حين لا نقطة فيه،
 * فيدخل في مفتاح الكائن اسمٌ عربي أو بمسافات — ورابط مكسور بعده.
 */
export const MIME_EXTENSION: Record<(typeof ALLOWED_MIME)[number], string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'application/pdf': 'pdf',
};

export function extensionFor(mimeType: string): string {
  return MIME_EXTENSION[mimeType as (typeof ALLOWED_MIME)[number]] ?? 'bin';
}
