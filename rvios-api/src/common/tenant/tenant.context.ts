import { AsyncLocalStorage } from 'node:async_hooks';

export interface TenantStore {
  /** معرّف الشركة من ترويسة x-company-id، إن وُجدت */
  companyId?: string;
  /** معرّف المستخدم من الـ JWT — للتدقيق */
  userId?: string;
}

const storage = new AsyncLocalStorage<TenantStore>();

/**
 * سياق المستأجر لكل طلب.
 *
 * `AsyncLocalStorage` بدل تمرير `companyId` عبر كل توقيع دالة: عندما تُضاف
 * وحدات التطبيق الخمس عشرة، أي خدمة تنسى تمريره تصير تسريب بيانات بين
 * الشركات. هنا يُحقن الفلتر في طبقة Prisma مرة واحدة (انظر prisma.service).
 */
export const TenantContext = {
  run<T>(store: TenantStore, fn: () => T): T {
    return storage.run(store, fn);
  },

  get(): TenantStore | undefined {
    return storage.getStore();
  },

  get companyId(): string | undefined {
    return storage.getStore()?.companyId;
  },

  /** يرمي إن غاب المعرّف — للمسارات التي لا معنى لها بلا شركة. */
  requireCompanyId(): string {
    const id = storage.getStore()?.companyId;
    if (!id) {
      throw new Error(
        'Tenant context missing: x-company-id header is required for this operation',
      );
    }
    return id;
  },
};
