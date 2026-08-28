import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { MediaType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediaService {
  private s3: S3Client;
  private bucket: string;
  private publicUrl: string;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    const accountId = this.config.get<string>('cloudflare.accountId');
    this.bucket = this.config.get<string>('cloudflare.bucketName') ?? 'rvios-media';
    this.publicUrl = this.config.get<string>('cloudflare.publicUrl') ?? '';

    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.config.get<string>('cloudflare.accessKeyId') ?? '',
        secretAccessKey: this.config.get<string>('cloudflare.secretAccessKey') ?? '',
      },
    });
  }

  // ── Upload file to R2 ────────────────────────────────────
  async upload(
    file: Express.Multer.File,
  ): Promise<{ url: string; filename: string }> {
    const ext = file.originalname.split('.').pop();
    const filename = `${uuidv4()}.${ext}`;
    const key = `uploads/${filename}`;

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
    } catch (err) {
      throw new InternalServerErrorException('فشل رفع الملف إلى Cloudflare R2');
    }

    const url = `${this.publicUrl}/${key}`;

    // Save record in DB
    const mediaType = this.detectType(file.mimetype);
    await this.prisma.media.create({
      data: {
        url,
        filename: key,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        type: mediaType,
      },
    });

    return { url, filename: key };
  }

  // ── Get presigned upload URL (direct-from-browser upload) ─
  async getPresignedUrl(filename: string, contentType: string) {
    const ext = filename.split('.').pop();
    const key = `uploads/${uuidv4()}.${ext}`;

    const url = await getSignedUrl(
      this.s3,
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: contentType,
      }),
      { expiresIn: 300 }, // 5 minutes
    );

    return { uploadUrl: url, key, publicUrl: `${this.publicUrl}/${key}` };
  }

  // ── List all media ───────────────────────────────────────
  findAll() {
    return this.prisma.media.findMany({ orderBy: { uploadedAt: 'desc' } });
  }

  // ── Delete from R2 + DB ──────────────────────────────────
  async remove(id: string) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) return { message: 'الملف غير موجود' };

    try {
      await this.s3.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: media.filename }),
      );
    } catch (_) {
      // ignore R2 errors on delete
    }

    await this.prisma.media.delete({ where: { id } });
    return { message: 'تم حذف الملف' };
  }

  // ── Helpers ──────────────────────────────────────────────
  private detectType(mimeType: string): MediaType {
    if (mimeType.startsWith('image/')) return MediaType.IMAGE;
    if (mimeType.startsWith('video/')) return MediaType.VIDEO;
    return MediaType.DOCUMENT;
  }
}
