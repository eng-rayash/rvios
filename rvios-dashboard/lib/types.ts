/**
 * أنواع عقد الـ API الإدارية.
 * مطابِقة لما يرجّعه `rvios-api/src/projects` — لا `any`.
 */

export interface Paginated<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number; hasNext: boolean };
}

export type ProjectStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type MetricDirection = "UP" | "DOWN" | "NEUTRAL";

export interface ProjectCategory {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  order: number;
}

export interface ProjectImage {
  id: string;
  url: string;
  alt: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  blurHash: string | null;
  order: number;
}

export interface ProjectMetric {
  id?: string;
  label: string;
  /** نص لا رقم: «٣٢» و«×٤» و«٤٫٨» */
  value: string;
  unit?: string | null;
  direction?: MetricDirection;
  order?: number;
}

export interface ApproachStep {
  title: string;
  desc: string;
}

/** ما يرجّعه `GET /admin/projects` — شكل البطاقة + الحالة. */
export interface AdminProject {
  id: string;
  slug: string;
  title: string;
  summary: string;
  client: string | null;
  industry: string | null;
  year: number | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  coverBlurHash: string | null;
  technologies: string[];
  featured: boolean;
  order: number;
  status: ProjectStatus;
  publishedAt: string | null;
  createdAt: string;
  views: number;
  category: { id: string; name: string; slug: string } | null;
  metrics: ProjectMetric[];

  /* الحقول التفصيلية — تأتي من `GET /admin/projects/:id` فقط */
  titleEn?: string | null;
  description?: string;
  challenge?: string | null;
  solution?: string | null;
  outcome?: string | null;
  approach?: unknown;
  clientLogoUrl?: string | null;
  durationMonths?: number | null;
  role?: string | null;
  teamSize?: number | null;
  categoryId?: string | null;
  gallery?: ProjectImage[];
  services?: { service: { id: string; title: string; slug: string } }[];
  testimonialQuote?: string | null;
  testimonialAuthor?: string | null;
  testimonialRole?: string | null;
  testimonialAvatarUrl?: string | null;
  liveUrl?: string | null;
  repoUrl?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImageUrl?: string | null;
}

/** استجابة `POST /media/presign` */
export interface PresignResult {
  uploadUrl: string;
  key: string;
  publicUrl: string;
}

/**
 * خطأ الـ API الموحّد من `AllExceptionsFilter`.
 * `details` يحمل الحقول الإضافية — مثل `missing` من بوّابة النشر.
 */
export interface ApiErrorBody {
  statusCode: number;
  message: string | string[];
  details?: { missing?: string[] } & Record<string, unknown>;
  path: string;
  timestamp: string;
}

export function parseApproach(value: unknown): ApproachStep[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (s): s is ApproachStep =>
      typeof s === "object" && s !== null &&
      typeof (s as ApproachStep).title === "string" &&
      typeof (s as ApproachStep).desc === "string",
  );
}
