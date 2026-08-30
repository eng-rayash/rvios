import { Type } from 'class-transformer';
import { IsIn, IsInt, IsString, Matches, Max, MaxLength, Min } from 'class-validator';
import { ALLOWED_MIME, MAX_UPLOAD_SIZE } from '../allowed-mime';

/**
 * تسجيل ملف رُفع مباشرة إلى R2 برابط موقّع.
 *
 * الرفع المباشر لا يمرّ بالخادم، فلولا هذه الخطوة لبقي الملف في الدلو
 * بلا سجلّ: لا يظهر في مكتبة الوسائط ولا يمكن حذفه منها.
 */
export class RegisterMediaDto {
  /* المفتاح يأتي من `presign` — نقيّده بالشكل الذي يولّده الخادم حتى لا
     يُسجَّل مسار عشوائي يشير خارج مجلّد الرفع. */
  @IsString()
  @Matches(/^uploads\/[A-Za-z0-9-]+\.[A-Za-z0-9]{1,10}$/, {
    message: 'مفتاح غير صالح',
  })
  key: string;

  @IsString() @MaxLength(255) originalName: string;

  @IsIn(ALLOWED_MIME, { message: 'نوع الملف غير مدعوم' })
  contentType: string;

  @Type(() => Number) @IsInt() @Min(0) @Max(MAX_UPLOAD_SIZE) size: number;
}
