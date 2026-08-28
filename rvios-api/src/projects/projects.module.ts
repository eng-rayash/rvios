import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsAdminController } from './projects.admin.controller';
import { ProjectsService } from './projects.service';

@Module({
  controllers: [ProjectsController, ProjectsAdminController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
