import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { ProjectsService } from './projects.service';
import { QueryProjectsDto } from './dto/query-projects.dto';
import {
  AddImagesDto, CreateProjectDto, ReorderDto, UpdateProjectDto,
} from './dto/project.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

/**
 * المسارات الإدارية للمعرض.
 *
 * الحراسة على مستوى الصنف: أي مسار يُضاف لاحقاً يرث الحماية تلقائياً،
 * وهو ما منع تكراره سهوُ `ProjectsController` القديم الذي كان بلا أدوار.
 */
@ApiTags('projects-admin')
@ApiBearerAuth()
@Controller('admin/projects')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN, UserRole.EDITOR)
export class ProjectsAdminController {
  constructor(private svc: ProjectsService) {}

  @Get()
  findAll(@Query() query: QueryProjectsDto) {
    return this.svc.findAllAdmin(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.svc.create(dto);
  }

  /* قبل ':id' وإلا فُسِّر «reorder» كمعرّف مشروع */
  @Patch('reorder')
  reorder(@Body() dto: ReorderDto) {
    return this.svc.reorder(dto.items, 'project');
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.svc.update(id, dto);
  }

  @Post(':id/publish')
  publish(@Param('id') id: string) {
    return this.svc.publish(id);
  }

  @Post(':id/unpublish')
  unpublish(@Param('id') id: string) {
    return this.svc.unpublish(id);
  }

  @Post(':id/images')
  addImages(@Param('id') id: string, @Body() dto: AddImagesDto) {
    return this.svc.addImages(id, dto.images);
  }

  @Patch(':id/images/reorder')
  reorderImages(@Body() dto: ReorderDto) {
    return this.svc.reorder(dto.items, 'projectImage');
  }

  @Delete('images/:imageId')
  removeImage(@Param('imageId') imageId: string) {
    return this.svc.removeImage(imageId);
  }

  /** الحذف نهائي — للمدير وحده */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
