import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { TenantContext } from './tenant.context';

/**
 * يفتح سياق المستأجر لكل طلب.
 *
 * يعمل قبل الحُرّاس، فالـ userId غير متاح بعد؛ يُملأ لاحقاً من الـ JWT
 * في `TenantInterceptor`. أما `companyId` فيأتي من الترويسة مباشرة.
 */
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const raw = req.headers['x-company-id'];
    const companyId = Array.isArray(raw) ? raw[0] : raw;

    TenantContext.run(
      { companyId: companyId?.trim() || undefined },
      () => next(),
    );
  }
}
