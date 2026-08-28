import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { QueryProjectsDto } from './dto/query-projects.dto';

/**
 * المسارات العامة لمعرض الأعمال.
 *
 * لا حُرّاس هنا، وإقصاء المسودّات يقع في الخدمة لا في المتحكّم — فلا
 * يمكن لمسار جديد أن يسرّب مشروعاً غير منشور بالسهو.
 */
@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private svc: ProjectsService) {}

  /** GET /api/v1/projects — شبكة المعرض مع الفلترة والترقيم */
  @Get()
  findPublic(@Query() query: QueryProjectsDto) {
    return this.svc.findPublic(query);
  }

  /** GET /api/v1/projects/filters — خيارات الفلاتر بأعدادها */
  @Get('filters')
  filters() {
    return this.svc.filters();
  }

  /** GET /api/v1/projects/categories */
  @Get('categories')
  categories() {
    return this.svc.categories();
  }

  /** GET /api/v1/projects/slugs — لـ generateStaticParams و sitemap */
  @Get('slugs')
  slugs() {
    return this.svc.slugs();
  }

  /** GET /api/v1/projects/:slug — صفحة المشروع الكاملة.
   *  مُعرَّف أخيراً حتى لا يبتلع المسارات الثابتة أعلاه. */
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.svc.findBySlug(slug);
  }
}
