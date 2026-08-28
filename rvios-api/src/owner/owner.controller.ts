import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { OwnerService, UpdateOwnerProfileDto } from './owner.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('owner')
export class OwnerController {
  constructor(private svc: OwnerService) {}

  // Public — anyone can read the owner profile
  @Get('profile')
  getProfile() { return this.svc.getProfile(); }

  // Admin only — update
  @Put('profile')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  updateProfile(@Body() dto: UpdateOwnerProfileDto) { return this.svc.updateProfile(dto); }
}
