import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PostStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto, PostQueryDto } from './dto/post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  // ── Public: Published posts ───────────────────────────────
  async findPublished(query: PostQueryDto) {
    const { page = 1, limit = 10, search, categorySlug, featured } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      status: PostStatus.PUBLISHED,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(categorySlug && { category: { slug: categorySlug } }),
      ...(featured !== undefined && { featured }),
    };

    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: { category: true },
        orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!post || post.status !== PostStatus.PUBLISHED) {
      throw new NotFoundException('المقال غير موجود');
    }
    // Increment views
    await this.prisma.post.update({ where: { slug }, data: { views: { increment: 1 } } });
    return post;
  }

  // ── Admin: All posts ──────────────────────────────────────
  async findAll(query: PostQueryDto) {
    const { page = 1, limit = 20, search, status, categorySlug } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(categorySlug && { category: { slug: categorySlug } }),
    };

    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: { category: { select: { id: true, name: true, slug: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.post.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!post) throw new NotFoundException('المقال غير موجود');
    return post;
  }

  async create(dto: CreatePostDto) {
    const existing = await this.prisma.post.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('الرابط (slug) مستخدم بالفعل');

    return this.prisma.post.create({
      data: {
        ...dto,
        keywords: dto.keywords ?? [],
        tags: dto.tags ?? [],
        publishedAt: dto.status === PostStatus.PUBLISHED ? new Date() : null,
      },
      include: { category: true },
    });
  }

  async update(id: string, dto: UpdatePostDto) {
    await this.findOne(id);
    const data: Record<string, unknown> = { ...dto };
    if (dto.status === PostStatus.PUBLISHED) {
      const current = await this.findOne(id);
      if (!current.publishedAt) data.publishedAt = new Date();
    }
    return this.prisma.post.update({ where: { id }, data, include: { category: true } });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.post.delete({ where: { id } });
    return { message: 'تم حذف المقال' };
  }
}
