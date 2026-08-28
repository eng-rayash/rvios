import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { SettingsService } from './settings.service';
import { BulkUpdateSettingsDto, UpdateSettingDto } from './dto/setting.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('settings')
export class SettingsController {
  constructor(private svc: SettingsService) {}

  // GET /api/settings/public — no auth; allow-listed keys only.
  // Declared before ':key' so it is not swallowed by the param route.
  @Get('public')
  findPublic() { return this.svc.findPublic(); }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() { return this.svc.findAll(); }

  @Get(':key')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(@Param('key') key: string) { return this.svc.findByKey(key); }

  @Put(':key')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('key') key: string, @Body() dto: UpdateSettingDto) {
    return this.svc.update(key, dto);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  bulkUpdate(@Body() dto: BulkUpdateSettingsDto) {
    return this.svc.bulkUpdate(dto.settings);
  }
}
