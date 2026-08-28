import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';

/**
 * يحوّل أخطاء Prisma الخام إلى ردود HTTP صحيحة.
 *
 * قبل هذا كان تعارض slug يخرج 500 «Internal server error»، فيبدو عطلاً في
 * الخادم بينما هو خطأ إدخال من المستخدم. معالجته هنا مرّة واحدة تُغني عن
 * try/catch في كل خدمة.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const { status, message, details } = this.translate(exception);

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${req.method} ${req.url} → ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    res.status(status).json({
      statusCode: status,
      message,
      ...(details ? { details } : {}),
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }

  private translate(e: unknown): {
    status: number;
    message: string | string[];
    details?: unknown;
  } {
    if (e instanceof HttpException) {
      const body = e.getResponse();
      if (typeof body === 'string') {
        return { status: e.getStatus(), message: body };
      }

      /* نحتفظ بالحقول الإضافية التي وضعها المُطلِق عمداً — مثل `missing`
         في بوّابة النشر. إسقاطها كان يحوّل رسالة «ينقصك كذا» إلى 422 صامتة. */
      const { message, statusCode: _sc, error: _err, ...extra } = body as Record<
        string,
        unknown
      > & { message?: string | string[] };

      return {
        status: e.getStatus(),
        message: (message as string | string[]) ?? e.message,
        details: Object.keys(extra).length ? extra : undefined,
      };
    }

    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      switch (e.code) {
        case 'P2002': {
          const target = (e.meta?.target as string[] | undefined)?.join('، ');
          return {
            status: HttpStatus.CONFLICT,
            message: target
              ? `القيمة مستخدَمة بالفعل: ${target}`
              : 'القيمة مستخدَمة بالفعل',
          };
        }
        case 'P2025':
          return { status: HttpStatus.NOT_FOUND, message: 'العنصر غير موجود' };
        case 'P2003':
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'مرجع غير صالح — العنصر المرتبط غير موجود',
          };
        case 'P2014':
          return {
            status: HttpStatus.CONFLICT,
            message: 'لا يمكن الحذف: توجد عناصر مرتبطة',
          };
      }
    }

    if (e instanceof Prisma.PrismaClientValidationError) {
      return { status: HttpStatus.BAD_REQUEST, message: 'بيانات الطلب غير صالحة' };
    }

    if (e instanceof Prisma.PrismaClientInitializationError) {
      return {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'الخدمة غير متاحة مؤقتاً',
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'حدث خطأ غير متوقع',
    };
  }
}
