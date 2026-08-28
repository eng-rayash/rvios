import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma, ProjectStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { paginate, type Paginated } from '../common/dto/pagination.dto';
import type { QueryProjectsDto } from './dto/query-projects.dto';
import type {
  CreateProjectDto,
  ProjectImageDto,
  ReorderItemDto,
  UpdateProjectDto,
} from './dto/project.dto';

/** ما تحتاجه بطاقة الشبكة — لا نرسل السرد الكامل لأربع وعشرين بطاقة. */
const CARD_SELECT = {
  id: true, slug: true, title: true, summary: true,
  client: true, industry: true, year: true,
  coverImageUrl: true, coverImageAlt: true, coverBlurHash: true,
  technologies: true, featured: true, order: true, publishedAt: true, views: true,
  category: { select: { id: true, name: true, slug: true } },
  metrics: {
    /* أبرز مؤشّر واحد يكفي للبطاقة */
    take: 1,
    orderBy: { order: 'asc' },
    select: { label: true, value: true, unit: true, direction: true },
  },
} satisfies Prisma.ProjectSelect;

const DETAIL_INCLUDE = {
  category: true,
  gallery: { orderBy: { order: 'asc' } },
  metrics: { orderBy: { order: 'asc' } },
  services: { include: { service: { select: { id: true, title: true, slug: true } } } },
} satisfies Prisma.ProjectInclude;

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  /* المرشّح العام في مكان واحد: أي مسار عام يمرّ به، فلا يمكن أن ينسى
     متحكّمٌ إقصاء المسودّات. */
  private readonly publicWhere: Prisma.ProjectWhereInput = {
    status: ProjectStatus.PUBLISHED,
  };

  // ── عام: الشبكة ───────────────────────────────────────────
  async findPublic(q: QueryProjectsDto): Promise<Paginated<unknown>> {
    const where: Prisma.ProjectWhereInput = {
      ...this.publicWhere,
      ...(q.category && { category: { slug: q.category } }),
      ...(q.service && { services: { some: { service: { slug: q.service } } } }),
      ...(q.tech && { technologies: { has: q.tech } }),
      ...(q.industry && { industry: q.industry }),
      ...(q.year && { year: q.year }),
      ...(q.featured !== undefined && { featured: q.featured }),
      ...(q.search && {
        OR: [
          { title: { contains: q.search, mode: 'insensitive' } },
          { summary: { contains: q.search, mode: 'insensitive' } },
          { client: { contains: q.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        select: CARD_SELECT,
        /* ترتيب ثانوي ثابت: بدونه تتذبذب نتائج الصفحتين عند تساوي المفتاح */
        orderBy: [{ [q.sort]: q.order }, { id: 'asc' }],
        skip: q.skip,
        take: q.limit,
      }),
      this.prisma.project.count({ where }),
    ]);

    return paginate(data, total, { page: q.page, limit: q.limit });
  }

  /**
   * تجميعات الفلاتر.
   *
   * لا تُبنى من نتائج الصفحة الحالية: الصفحة الأولى لا تعرف التقنيات
   * الموجودة في الصفحة الثالثة، فتظهر فلاتر ناقصة.
   */
  async filters() {
    const [categories, industries, years, projects] = await Promise.all([
      this.prisma.projectCategory.findMany({
        orderBy: { order: 'asc' },
        select: {
          id: true, name: true, slug: true,
          _count: { select: { projects: { where: this.publicWhere } } },
        },
      }),
      this.prisma.project.groupBy({
        by: ['industry'],
        where: { ...this.publicWhere, industry: { not: null } },
        _count: { industry: true },
      }),
      this.prisma.project.groupBy({
        by: ['year'],
        where: { ...this.publicWhere, year: { not: null } },
        _count: { year: true },
        orderBy: { year: 'desc' },
      }),
      this.prisma.project.findMany({
        where: this.publicWhere,
        select: { technologies: true },
      }),
    ]);

    /* التقنيات مصفوفة داخل الصف، فلا يمكن تجميعها في SQL عبر Prisma */
    const techCount = new Map<string, number>();
    for (const p of projects) {
      for (const t of p.technologies) techCount.set(t, (techCount.get(t) ?? 0) + 1);
    }

    return {
      categories: categories
        .filter((c) => c._count.projects > 0)
        .map(({ _count, ...c }) => ({ ...c, count: _count.projects })),
      industries: industries.map((i) => ({
        value: i.industry!,
        count: i._count.industry,
      })),
      years: years.map((y) => ({ value: y.year!, count: y._count.year })),
      technologies: [...techCount.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([value, count]) => ({ value, count })),
    };
  }

  /** أسماء المسارات فقط — لـ generateStaticParams و sitemap. */
  slugs() {
    return this.prisma.project.findMany({
      where: this.publicWhere,
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: 'desc' },
    });
  }

  // ── عام: التفصيل ──────────────────────────────────────────
  async findBySlug(slug: string) {
    const project = await this.prisma.project.findFirst({
      where: { slug, ...this.publicWhere },
      include: DETAIL_INCLUDE,
    });
    if (!project) throw new NotFoundException('المشروع غير موجود');

    /* عدّاد المشاهدات لا يجوز أن يُعطّل عرض الصفحة إن فشل */
    this.prisma.project
      .update({ where: { id: project.id }, data: { views: { increment: 1 } } })
      .catch(() => undefined);

    const [related, neighbours] = await Promise.all([
      this.prisma.project.findMany({
        where: {
          ...this.publicWhere,
          id: { not: project.id },
          ...(project.categoryId && { categoryId: project.categoryId }),
        },
        select: CARD_SELECT,
        take: 3,
        orderBy: { order: 'asc' },
      }),
      this.neighbours(project.order, project.id),
    ]);

    return { ...project, related, ...neighbours };
  }

  /** المشروع السابق والتالي حسب الترتيب — للتنقّل أسفل الصفحة. */
  private async neighbours(order: number, id: string) {
    const pick = { slug: true, title: true, coverImageUrl: true } as const;
    const [prev, next] = await Promise.all([
      this.prisma.project.findFirst({
        where: { ...this.publicWhere, id: { not: id }, order: { lt: order } },
        orderBy: { order: 'desc' },
        select: pick,
      }),
      this.prisma.project.findFirst({
        where: { ...this.publicWhere, id: { not: id }, order: { gt: order } },
        orderBy: { order: 'asc' },
        select: pick,
      }),
    ]);
    return { prev, next };
  }

  // ── إداري ─────────────────────────────────────────────────
  async findAllAdmin(q: QueryProjectsDto) {
    const where: Prisma.ProjectWhereInput = {
      ...(q.search && { title: { contains: q.search, mode: 'insensitive' } }),
    };
    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        select: { ...CARD_SELECT, status: true, createdAt: true },
        orderBy: [{ [q.sort]: q.order }, { id: 'asc' }],
        skip: q.skip,
        take: q.limit,
      }),
      this.prisma.project.count({ where }),
    ]);
    return paginate(data, total, { page: q.page, limit: q.limit });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: DETAIL_INCLUDE,
    });
    if (!project) throw new NotFoundException('المشروع غير موجود');
    return project;
  }

  async create(dto: CreateProjectDto) {
    const { metrics, serviceIds, approach, ...rest } = dto;
    return this.prisma.project.create({
      data: {
        ...rest,
        approach: (approach ?? []) as unknown as Prisma.InputJsonValue,
        technologies: dto.technologies ?? [],
        ...(metrics?.length && {
          metrics: {
            create: metrics.map((m, i) => ({ ...m, order: m.order ?? i })),
          },
        }),
        ...(serviceIds?.length && {
          services: { create: serviceIds.map((serviceId) => ({ serviceId })) },
        }),
        ...(dto.status === ProjectStatus.PUBLISHED && { publishedAt: new Date() }),
      },
      include: DETAIL_INCLUDE,
    });
  }

  async update(id: string, dto: UpdateProjectDto) {
    const current = await this.prisma.project.findUnique({
      where: { id },
      select: { id: true, publishedAt: true },
    });
    if (!current) throw new NotFoundException('المشروع غير موجود');

    const { metrics, serviceIds, approach, ...rest } = dto;

    return this.prisma.$transaction(async (tx) => {
      /* المؤشّرات والخدمات تُستبدل كلياً: التعديل الجزئي لمجموعة مرتَّبة
         يحتاج معرّفات مستقرّة، والواجهة ترسل القائمة كاملة أصلاً. */
      if (metrics) {
        await tx.projectMetric.deleteMany({ where: { projectId: id } });
        if (metrics.length) {
          await tx.projectMetric.createMany({
            data: metrics.map((m, i) => ({ ...m, projectId: id, order: m.order ?? i })),
          });
        }
      }
      if (serviceIds) {
        await tx.projectService.deleteMany({ where: { projectId: id } });
        if (serviceIds.length) {
          await tx.projectService.createMany({
            data: serviceIds.map((serviceId) => ({ projectId: id, serviceId })),
          });
        }
      }

      return tx.project.update({
        where: { id },
        data: {
          ...rest,
          ...(approach && { approach: approach as unknown as Prisma.InputJsonValue }),
          /* أول نشر فقط يضبط التاريخ — إعادة النشر لا تُقدّم المقال في الترتيب */
          ...(dto.status === ProjectStatus.PUBLISHED &&
            !current.publishedAt && { publishedAt: new Date() }),
        },
        include: DETAIL_INCLUDE,
      });
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.project.delete({ where: { id } });
    return { message: 'تم حذف المشروع' };
  }

  /**
   * النشر يتحقّق من اكتمال الحقول الدنيا.
   *
   * صفحة مشروع بلا غلاف أو بلا نتائج تضرّ بالمعرض أكثر من غيابها،
   * فالمنع هنا خيار تحريري لا تقني.
   */
  async publish(id: string) {
    const p = await this.prisma.project.findUnique({
      where: { id },
      include: { metrics: true },
    });
    if (!p) throw new NotFoundException('المشروع غير موجود');

    const missing: string[] = [];
    if (!p.coverImageUrl) missing.push('صورة الغلاف');
    if (!p.summary) missing.push('الملخّص');
    if (!p.challenge) missing.push('التحدّي');
    if (!p.solution) missing.push('الحل');
    if (!p.metrics.length) missing.push('مؤشّر نتائج واحد على الأقل');

    if (missing.length) {
      throw new UnprocessableEntityException({
        message: 'لا يمكن النشر — حقول ناقصة',
        missing,
      });
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        status: ProjectStatus.PUBLISHED,
        publishedAt: p.publishedAt ?? new Date(),
      },
    });
  }

  async unpublish(id: string) {
    await this.findOne(id);
    return this.prisma.project.update({
      where: { id },
      data: { status: ProjectStatus.DRAFT },
    });
  }

  // ── الصور ─────────────────────────────────────────────────
  async addImages(projectId: string, images: ProjectImageDto[]) {
    await this.findOne(projectId);
    const max = await this.prisma.projectImage.aggregate({
      where: { projectId },
      _max: { order: true },
    });
    const base = (max._max.order ?? -1) + 1;

    await this.prisma.projectImage.createMany({
      data: images.map((img, i) => ({
        ...img,
        projectId,
        order: img.order ?? base + i,
      })),
    });
    return this.prisma.projectImage.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
    });
  }

  async removeImage(id: string) {
    const img = await this.prisma.projectImage.findUnique({ where: { id } });
    if (!img) throw new NotFoundException('الصورة غير موجودة');
    await this.prisma.projectImage.delete({ where: { id } });
    return { message: 'تم حذف الصورة', url: img.url };
  }

  /** إعادة ترتيب بالسحب — دفعة واحدة في معاملة. */
  async reorder(items: ReorderItemDto[], table: 'project' | 'projectImage') {
    await this.prisma.$transaction(
      items.map((i) =>
        table === 'project'
          ? this.prisma.project.update({ where: { id: i.id }, data: { order: i.order } })
          : this.prisma.projectImage.update({ where: { id: i.id }, data: { order: i.order } }),
      ),
    );
    return { message: 'تم حفظ الترتيب', count: items.length };
  }

  // ── التصنيفات ─────────────────────────────────────────────
  categories() {
    return this.prisma.projectCategory.findMany({ orderBy: { order: 'asc' } });
  }
}
