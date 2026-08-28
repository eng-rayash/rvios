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
