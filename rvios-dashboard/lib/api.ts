import type {
  AdminProject,
  ApiErrorBody,
  Paginated,
  ProjectCategory,
  ProjectImage,
} from './types';

const rawApiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')
  .trim()
  .replace(/\/+$/, '');

/**
 * يقبل الأصل وحده أو المسار الكامل، ويصل دائماً إلى `<origin>/api/v1`.
 * المنطق السابق كان يُلحق `/api` بأي قيمة لا تنتهي به، فأنتج `/api/v1/api`
 * بعد إضافة الإصدار.
 */
export const API_BASE = /\/api\/v\d+$/.test(rawApiUrl)
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/api$/, '')}/api/v1`;

// ── Auth ──────────────────────────────────────────────────────
export async function login(email: string, password: string) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'بيانات الدخول غير صحيحة');
    }
    return res.json() as Promise<{ accessToken: string; refreshToken: string }>;
  } catch (err: any) {
    if (err.name === 'TypeError' || err.message?.includes('Failed to fetch')) {
      throw new Error('تعذر الاتصال بالسيرفر (API). يرجى التأكد من تشغيل الخادم (pnpm dev أو pnpm dev:api) و Docker');
    }
    throw err;
  }
}

export async function refreshTokens(refreshToken: string) {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) throw new Error('انتهت الجلسة');
  return res.json() as Promise<{ accessToken: string; refreshToken: string }>;
}

export async function logout(refreshToken: string) {
  await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
}

/* ══════════════════════════════════════════════════════════════
   تجديد التوكن عند 401

   يسجّله `AuthProvider` عند الإقلاع. وضعُه هنا بدل استدعاء React
   مباشرةً يُبقي `apiFetch` صالحاً للاستدعاء من خارج شجرة المكوّنات.
   ══════════════════════════════════════════════════════════════ */

/** خطأ يحفظ رمز الحالة والحقول الإضافية بدل تسطيحها إلى نصّ. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details?: ApiErrorBody['details'],
  ) {
    super(message);
    this.name = 'ApiError';
  }

  /** قائمة النواقص من بوّابة النشر (422) */
  get missing(): string[] {
    return this.details?.missing ?? [];
  }
}

type RefreshHandler = () => Promise<string | null>;

let onUnauthorized: RefreshHandler | null = null;

export function registerRefreshHandler(fn: RefreshHandler | null) {
  onUnauthorized = fn;
}

// ── Generic authenticated fetch ───────────────────────────────
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const send = async (bearer?: string) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    if (bearer) headers['Authorization'] = `Bearer ${bearer}`;
    return fetch(`${API_BASE}${path}`, { ...options, headers });
  };

  try {
    let res = await send(token);

    /* 401 ⇒ حاول التجديد مرة واحدة ثم أعد الطلب.
       مرة واحدة فقط: لو فشل التوكن الجديد أيضاً فالمشكلة ليست الانتهاء،
       وإعادة المحاولة تصير حلقة. */
    if (res.status === 401 && token && onUnauthorized) {
      const fresh = await onUnauthorized();
      if (fresh) res = await send(fresh);
    }

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as Partial<ApiErrorBody>;
      /* `ApiError` يحمل `details` — بوّابة النشر ترجّع 422 مع
         `details.missing` وهي قائمة الحقول الناقصة التي يجب أن يراها
         المحرّر. الرمي بـ `new Error(message)` كان يُسقطها. */
      throw new ApiError(
        Array.isArray(body.message) ? body.message.join('، ') : body.message || `HTTP ${res.status}`,
        res.status,
        body.details,
      );
    }
    /* 204 لا يحمل جسماً — `res.json()` عليه يرمي */
    return res.status === 204 ? (undefined as T) : res.json();
  } catch (err: any) {
    if (err.name === 'TypeError' || err.message?.includes('Failed to fetch')) {
      throw new Error('تعذر الاتصال بالسيرفر (API)');
    }
    throw err;
  }
}

// ── Posts ─────────────────────────────────────────────────────
export const postsApi = {
  list: (token: string, params?: string) =>
    apiFetch<any>(`/posts?${params ?? ''}`, {}, token),
  get: (token: string, id: string) =>
    apiFetch<any>(`/posts/${id}`, {}, token),
  create: (token: string, data: object) =>
    apiFetch<any>('/posts', { method: 'POST', body: JSON.stringify(data) }, token),
  update: (token: string, id: string, data: object) =>
    apiFetch<any>(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),
  delete: (token: string, id: string) =>
    apiFetch<any>(`/posts/${id}`, { method: 'DELETE' }, token),
};

// ── Categories ────────────────────────────────────────────────
export const categoriesApi = {
  list: () => apiFetch<any>('/categories'),
  create: (token: string, data: object) =>
    apiFetch<any>('/categories', { method: 'POST', body: JSON.stringify(data) }, token),
  update: (token: string, id: string, data: object) =>
    apiFetch<any>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),
  delete: (token: string, id: string) =>
    apiFetch<any>(`/categories/${id}`, { method: 'DELETE' }, token),
};

// ── Services ──────────────────────────────────────────────────
export const servicesApi = {
  list: (token: string) => apiFetch<any>('/services', {}, token),
  create: (token: string, data: object) =>
    apiFetch<any>('/services', { method: 'POST', body: JSON.stringify(data) }, token),
  update: (token: string, id: string, data: object) =>
    apiFetch<any>(`/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),
  delete: (token: string, id: string) =>
    apiFetch<any>(`/services/${id}`, { method: 'DELETE' }, token),
};

// ── Contacts ──────────────────────────────────────────────────
export const contactsApi = {
  list: (token: string) => apiFetch<any>('/contacts', {}, token),
  stats: (token: string) => apiFetch<any>('/contacts/stats', {}, token),
  updateStatus: (token: string, id: string, status: string) =>
    apiFetch<any>(`/contacts/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }, token),
  delete: (token: string, id: string) =>
    apiFetch<any>(`/contacts/${id}`, { method: 'DELETE' }, token),
};

// ── Media ─────────────────────────────────────────────────────
export const mediaApi = {
  list: (token: string) => apiFetch<any>('/media', {}, token),
  presign: (token: string, filename: string, contentType: string) =>
    apiFetch<any>('/media/presign', { method: 'POST', body: JSON.stringify({ filename, contentType }) }, token),
  /** يُستدعى بعد نجاح الرفع المباشر — بدونه لا يظهر الملف في المكتبة */
  register: (
    token: string,
    data: { key: string; originalName: string; contentType: string; size: number },
  ) => apiFetch<any>('/media/register', { method: 'POST', body: JSON.stringify(data) }, token),
  delete: (token: string, id: string) =>
    apiFetch<any>(`/media/${id}`, { method: 'DELETE' }, token),
};

// ── Settings ──────────────────────────────────────────────────
export const settingsApi = {
  list: (token: string) => apiFetch<any>('/settings', {}, token),
  bulkUpdate: (token: string, settings: { key: string; value: string }[]) =>
    apiFetch<any>('/settings', { method: 'PUT', body: JSON.stringify({ settings }) }, token),
};

// ── Owner ─────────────────────────────────────────────────────
export const ownerApi = {
  get: (token: string) => apiFetch<any>('/owner/profile', {}, token),
  update: (token: string, data: object) =>
    apiFetch<any>('/owner/profile', { method: 'PUT', body: JSON.stringify(data) }, token),
};

// ── Users ─────────────────────────────────────────────────────
export const usersApi = {
  list: (token: string) => apiFetch<any>('/users', {}, token),
  create: (token: string, data: object) =>
    apiFetch<any>('/users', { method: 'POST', body: JSON.stringify(data) }, token),
  delete: (token: string, id: string) =>
    apiFetch<any>(`/users/${id}`, { method: 'DELETE' }, token),
};

// ── Projects ──────────────────────────────────────────────────
/**
 * معرض الأعمال — المسارات الإدارية تحت `/admin/projects`.
 *
 * `/projects` بلا بادئة `admin` هو المسار **العام**: يُقصي المسودّات ويرجّع
 * `{data, meta}` مُرقَّماً. استعماله هنا كان يُظهر القائمة فارغة دائماً.
 */
export const projectsApi = {
  list: (token: string, params?: Record<string, string | number>) => {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(params ?? {})) {
      if (v !== undefined && v !== '') q.set(k, String(v));
    }
    const s = q.toString();
    return apiFetch<Paginated<AdminProject>>(`/admin/projects${s ? `?${s}` : ''}`, {}, token);
  },

  get: (token: string, id: string) =>
    apiFetch<AdminProject>(`/admin/projects/${id}`, {}, token),

  create: (token: string, data: object) =>
    apiFetch<AdminProject>('/admin/projects', { method: 'POST', body: JSON.stringify(data) }, token),

  update: (token: string, id: string, data: object) =>
    apiFetch<AdminProject>(`/admin/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, token),

  delete: (token: string, id: string) =>
    apiFetch<{ message: string }>(`/admin/projects/${id}`, { method: 'DELETE' }, token),

  /** ترتيب دفعة واحدة في معاملة — لا طلب لكل عنصر */
  reorder: (token: string, items: { id: string; order: number }[]) =>
    apiFetch<{ message: string; count: number }>(
      '/admin/projects/reorder',
      { method: 'PATCH', body: JSON.stringify({ items }) },
      token,
    ),

  /** يرجّع 422 مع `details.missing` إن نقص حقل — تُعرض للمحرّر كما هي */
  publish: (token: string, id: string) =>
    apiFetch<AdminProject>(`/admin/projects/${id}/publish`, { method: 'POST' }, token),

  unpublish: (token: string, id: string) =>
    apiFetch<AdminProject>(`/admin/projects/${id}/unpublish`, { method: 'POST' }, token),

  addImages: (token: string, id: string, images: object[]) =>
    apiFetch<ProjectImage[]>(
      `/admin/projects/${id}/images`,
      { method: 'POST', body: JSON.stringify({ images }) },
      token,
    ),

  reorderImages: (token: string, id: string, items: { id: string; order: number }[]) =>
    apiFetch<{ message: string }>(
      `/admin/projects/${id}/images/reorder`,
      { method: 'PATCH', body: JSON.stringify({ items }) },
      token,
    ),

  deleteImage: (token: string, imageId: string) =>
    apiFetch<{ message: string }>(`/admin/projects/images/${imageId}`, { method: 'DELETE' }, token),

  categories: () => apiFetch<ProjectCategory[]>('/projects/categories'),
};
