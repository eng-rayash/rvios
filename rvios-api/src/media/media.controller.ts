import {
  BadRequestException, Body, Controller, Delete, Get, Param,
  Post, UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { memoryStorage } from 'multer';
import { UserRole } from '@prisma/client';
import { MediaService } from './media.service';
import { PresignDto } from './dto/presign.dto';
import { RegisterMediaDto } from './dto/register.dto';
import { ALLOWED_MIME, MAX_UPLOAD_SIZE } from './allowed-mime';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('media')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN, UserRole.EDITOR)
export class MediaController {
  constructor(private svc: MediaService) {}

  // GET  /api/media
  @Get()
  findAll() { return this.svc.findAll(); }

  // POST /api/media/upload  — multipart file upload
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_UPLOAD_SIZE },
      /* `BadRequestException` لا `Error`: الأخير يخرج 500، فيقرأ المحرّر
         «خطأ في الخادم» بينما الخطأ في ملفه هو. */
      fileFilter: (_req, file, cb) => {
        if ((ALLOWED_MIME as readonly string[]).includes(file.mimetype)) cb(null, true);
        else cb(new BadRequestException(`نوع الملف غير مدعوم: ${file.mimetype}`), false);
      },
    }),
  )
  upload(@UploadedFile() file?: Express.Multer.File) {
    /* الطلب بلا حقل `file` — أو بحقل باسم آخر — كان يصل إلى الخدمة
       فيرمي TypeError على `undefined.originalname` ويخرج 500. */
    if (!file) throw new BadRequestException('لم يُرفَق ملف');
    return this.svc.upload(file);
  }

  // POST /api/media/presign  — get presigned URL for direct upload
  @Post('presign')
  presign(@Body() dto: PresignDto) {
    return this.svc.getPresignedUrl(dto.filename, dto.contentType);
  }

  // POST /api/media/register — record a file uploaded straight to R2
  @Post('register')
  register(@Body() dto: RegisterMediaDto) {
    return this.svc.register(dto);
  }

  // DELETE /api/media/:id — destructive, admin only
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) { return this.svc.remove(id); }
}
