import { IsIn, IsString, MaxLength, MinLength } from 'class-validator';
import { ALLOWED_MIME } from '../allowed-mime';

export class PresignDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  filename: string;

  /**
   * Without this constraint the presigned URL would accept any content type,
   * letting a caller put arbitrary HTML/executables into a public bucket —
   * bypassing the multipart upload's fileFilter entirely.
   */
  @IsIn(ALLOWED_MIME, { message: 'نوع الملف غير مدعوم' })
  contentType: string;
}
