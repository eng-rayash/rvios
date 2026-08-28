import {
  Body, Controller, Delete, Get, Param,
  Post, UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { memoryStorage } from 'multer';
import { UserRole } from '@prisma/client';
import { MediaService } from './media.service';
import { PresignDto } from './dto/presign.dto';
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
      fileFilter: (_req, file, cb) => {
        if ((ALLOWED_MIME as readonly string[]).includes(file.mimetype)) cb(null, true);
        else cb(new Error('نوع الملف غير مدعوم'), false);
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.svc.upload(file);
  }

  // POST /api/media/presign  — get presigned URL for direct upload
  @Post('presign')
  presign(@Body() dto: PresignDto) {
    return this.svc.getPresignedUrl(dto.filename, dto.contentType);
  }

  // DELETE /api/media/:id — destructive, admin only
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) { return this.svc.remove(id); }
}
