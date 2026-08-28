import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { TenantContext } from '../common/tenant/tenant.context';

/**
 * النماذج التي تملك عمود `companyId`.
 *
 * تُكتشف من DMMF لا من قائمة يدوية: أي نموذج جديد من وحدات التطبيق يصير
 * معزولاً تلقائياً بمجرّد أن يحمل الحقل — بلا سطر في أي خدمة، وبلا قائمة
 * تنسى أحداً. نماذج المنصّة العشرة الحالية لا تملكه فتمرّ بلا مساس.
 */
const SCOPED_MODELS = new Set(
  Prisma.dmmf.datamodel.models
    .filter((m) => m.fields.some((f) => f.name === 'companyId'))
    .map((m) => m.name),
);

/** عمليات تقبل `where` مركّباً فيمكن تقييدها مباشرة. */
const FILTERABLE_OPS = new Set([
  'findFirst', 'findFirstOrThrow', 'findMany', 'count',
  'aggregate', 'groupBy', 'updateMany', 'deleteMany',
]);

/**
 * `findUnique` أيضاً — منذ Prisma 5 صار `where` فيه يقبل مرشّحات غير فريدة
 * إلى جانب الحقل الفريد (extendedWhereUnique). بدون تقييده كان طلبٌ بمعرّف
 * صفٍّ يخصّ شركة أخرى سينجح، وهي أوضح ثغرة تسريب بين المستأجرين.
 */
const UNIQUE_OPS = new Set(['findUnique', 'findUniqueOrThrow']);

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  /**
   * عميل مُوسَّع يحقن فلتر الشركة تلقائياً.
   *
   * استعمل `prisma.scoped.<model>` في كل ما يخصّ بيانات المستأجرين،
   * و`prisma.<model>` مباشرةً لنماذج المنصّة العامة (المقالات، الخدمات…).
   */
  readonly scoped = this.$extends({
    query: {
      $allModels: {
        $allOperations({ model, operation, args, query }) {
          const companyId = TenantContext.companyId;
          if (!companyId || !model || !SCOPED_MODELS.has(model)) {
            return query(args);
          }

          const a = (args ?? {}) as { where?: Record<string, unknown> };

          if (FILTERABLE_OPS.has(operation) || UNIQUE_OPS.has(operation)) {
            return query({ ...a, where: { ...(a.where ?? {}), companyId } } as typeof args);
          }

          if (operation === 'create') {
            const c = a as { data?: Record<string, unknown> };
            /* الأنواع المولَّدة تغطّي كل النماذج مجتمعةً، ولا يعرف TypeScript
               هنا أننا داخل نموذج يملك companyId — فالتأكيد عبر unknown مقصود. */
            return query({
              ...c,
              data: { companyId, ...(c.data ?? {}) },
            } as unknown as typeof args);
          }

          return query(args);
        },
      },
    },
  });

  async onModuleInit() {
    await this.$connect();
    this.logger.log(
      SCOPED_MODELS.size
        ? `Tenant scoping active for: ${[...SCOPED_MODELS].join(', ')}`
        : 'No tenant-scoped models yet — platform models are global by design',
    );
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /** هل هذا النموذج معزول بالشركة؟ يستعمله الاختبار للتحقق. */
  static isScoped(model: string) {
    return SCOPED_MODELS.has(model);
  }
}
