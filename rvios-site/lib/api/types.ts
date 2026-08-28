/**
 * أنواع عقد الـ API.
 *
 * مطابِقة حرفياً لـ `CARD_SELECT` و`DETAIL_INCLUDE` في
 * `rvios-api/src/projects/projects.service.ts`. أي تغيير هناك يجب أن يُقابَل
 * هنا — وإلا انكسر العرض وقت التشغيل بلا تحذير من المصرِّف.
 */

export interface Paginated<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
  };
}

export type MetricDirection = "UP" | "DOWN" | "NEUTRAL";

export interface ProjectMetric {
  label: string;
  /** نص لا رقم: يستوعب «٣٢» و«×٤» و«٤٫٨» — يُطبع كما هو بلا تنسيق */
  value: string;
  unit?: string | null;
  direction: MetricDirection;
}

export interface ProjectCategoryRef {
  id: string;
  name: string;
  slug: string;
}

/** شكل بطاقة الشبكة — لا يحوي السرد ولا المعرض ولا الشهادة. */
export interface ProjectCard {
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
  publishedAt: string | null;
  views: number;
  category: ProjectCategoryRef | null;
  /** الخادم يقيّده بـ `take: 1` — تعامل معه كعنصر واحد أو لا شيء */
  metrics: ProjectMetric[];
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

/** خطوة في `approach`. الحقل من نوع Json فلا يضمن المصرِّف شكله. */
export interface ApproachStep {
  title: string;
  desc: string;
}

/** جدول الوصل يصل متداخلاً: `services[i].service.title` لا `services[i].title`. */
export interface ProjectServiceLink {
  service: { id: string; title: string; slug: string };
}

export interface ProjectNeighbour {
  slug: string;
  title: string;
  coverImageUrl: string | null;
}

export interface ProjectDetail extends Omit<ProjectCard, "metrics" | "category"> {
  titleEn: string | null;
  description: string;
  challenge: string | null;
  solution: string | null;
  outcome: string | null;
  approach: unknown;
  clientLogoUrl: string | null;
  durationMonths: number | null;
  role: string | null;
  teamSize: number | null;
  category: (ProjectCategoryRef & { nameEn: string; order: number }) | null;
  services: ProjectServiceLink[];
  gallery: ProjectImage[];
  metrics: (ProjectMetric & { id: string; order: number })[];
  testimonialQuote: string | null;
  testimonialAuthor: string | null;
  testimonialRole: string | null;
  testimonialAvatarUrl: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  updatedAt: string;
  related: ProjectCard[];
  prev: ProjectNeighbour | null;
  next: ProjectNeighbour | null;
}

export interface FilterOption<V = string> {
  value: V;
  count: number;
}

export interface ProjectFilters {
  categories: (ProjectCategoryRef & { count: number })[];
  industries: FilterOption[];
  years: FilterOption<number>[];
  technologies: FilterOption[];
}

/** معاملات `QueryProjectsDto`. `limit` محدود بـ 48 و`sort` بقائمة مغلقة. */
export interface ProjectQuery {
  page?: number;
  limit?: number;
  sort?: "order" | "publishedAt" | "views" | "year" | "title";
  order?: "asc" | "desc";
  category?: string;
  service?: string;
  tech?: string;
  industry?: string;
  search?: string;
  year?: number;
  featured?: boolean;
}

/**
 * `approach` يصل كـ Json غير مُنمَّط. هذا الحارس يمنع انهيار الصفحة عند
 * شكل غير متوقّع بدل الوثوق بالنوع المُعلَن.
 */
export function parseApproach(value: unknown): ApproachStep[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (s): s is ApproachStep =>
      typeof s === "object" &&
      s !== null &&
      typeof (s as ApproachStep).title === "string" &&
      typeof (s as ApproachStep).desc === "string",
  );
}
