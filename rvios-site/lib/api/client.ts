import type {
  Paginated,
  ProjectCard,
  ProjectDetail,
  ProjectFilters,
  ProjectQuery,
} from "./types";

const rawApiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001")
  .trim()
  .replace(/\/+$/, '');

/** يقبل الأصل وحده أو المسار الكامل، ويصل دائماً إلى `<origin>/api/v1`. */
const API = /\/api\/v\d+$/.test(rawApiUrl)
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/api$/, '')}/api/v1`;

// ── Generic fetch helper ──────────────────────────────────────
async function get<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    next: { revalidate: 60 },
    ...opts,
  });
  if (!res.ok) throw new Error(`API Error: ${res.status} ${path}`);
  return res.json();
}

// ── Posts ─────────────────────────────────────────────────────
export async function getPublishedPosts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  categorySlug?: string;
  featured?: boolean;
}) {
  const q = new URLSearchParams();
  if (params?.page) q.set("page", String(params.page));
  if (params?.limit) q.set("limit", String(params.limit));
  if (params?.search) q.set("search", params.search);
  if (params?.categorySlug) q.set("categorySlug", params.categorySlug);
  if (params?.featured) q.set("featured", "true");
  return get<{ data: any[]; meta: { total: number; page: number; limit: number; totalPages: number } }>(
    `/posts/public?${q.toString()}`
  );
}

export async function getPostBySlug(slug: string) {
  return get<any>(`/posts/public/${slug}`);
}

// ── Categories ────────────────────────────────────────────────
export async function getCategories() {
  return get<any[]>("/categories");
}

// ── Services ──────────────────────────────────────────────────
export async function getServices() {
  return get<any[]>("/services/public");
}

export async function getServiceBySlug(slug: string) {
  return get<any>(`/services/public/${slug}`);
}

// ── Projects (معرض الأعمال) ───────────────────────────────────
// المسارات الفعلية: /projects · /filters · /categories · /slugs · /:slug
// (النسختان السابقتان كانتا تستدعيان /projects/public و/projects/public/featured
//  وكلاهما غير موجود في المتحكّم — فكانتا ترميان 404 دائماً.)

function buildQuery(params: ProjectQuery = {}): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export async function getProjects(params?: ProjectQuery) {
  return get<Paginated<ProjectCard>>(`/projects${buildQuery(params)}`);
}

export async function getProjectBySlug(slug: string) {
  return get<ProjectDetail>(`/projects/${encodeURIComponent(slug)}`);
}

export async function getProjectFilters() {
  return get<ProjectFilters>("/projects/filters");
}

/** لـ `generateStaticParams` و`sitemap` — خفيف بلا حقول ثقيلة. */
export async function getProjectSlugs() {
  return get<{ slug: string; updatedAt: string }[]>("/projects/slugs");
}

// ── Settings ─────────────────────────────────────────────────
export async function getSiteSettings() {
  try {
    const data = await get<any[]>("/settings");
    const map: Record<string, string> = {};
    data.forEach((s: any) => { map[s.key] = s.value; });
    return map;
  } catch {
    return {};
  }
}

// ── Contact form submission ───────────────────────────────────
export async function submitContact(data: {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}) {
  const res = await fetch(`${API}/contacts/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("فشل الإرسال");
  return res.json();
}
