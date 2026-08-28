import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { UserRole } from '@prisma/client';
import { ContactsService, CreateContactDto, UpdateContactStatusDto } from './contacts.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('contacts')
export class ContactsController {
  constructor(private svc: ContactsService) {}

  // Public: submit contact form — tightly throttled, it writes to the DB
  // and is the only unauthenticated write endpoint on the API.
  @Post('submit')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ short: { ttl: 60_000, limit: 3 }, long: { ttl: 3_600_000, limit: 10 } })
  create(@Body() dto: CreateContactDto) { return this.svc.create(dto); }

  // ── Admin ─────────────────────────────────────────────────
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  findAll() { return this.svc.findAll(); }

  @Get('stats')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  stats() { return this.svc.stats(); }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Put(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateContactStatusDto) {
    return this.svc.updateStatus(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) { return this.svc.remove(id); }
}
