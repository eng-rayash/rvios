import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SettingEntryDto, UpdateSettingDto } from './dto/setting.dto';

/**
 * Settings that may be read without authentication.
 *
 * An allow-list, not a deny-list: a new admin-only setting must never become
 * public just because someone forgot to exclude it.
 */
const PUBLIC_SETTING_KEYS = ['site_name', 'site_email', 'site_whatsapp'];

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.setting.findMany({ orderBy: { key: 'asc' } }); }

  /** Public subset, shaped as a { key: value } map for the marketing site. */
  async findPublic(): Promise<Record<string, string>> {
    const rows = await this.prisma.setting.findMany({
      where: { key: { in: PUBLIC_SETTING_KEYS } },
      select: { key: true, value: true },
    });
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }

  async findByKey(key: string) {
    const s = await this.prisma.setting.findUnique({ where: { key } });
    if (!s) throw new NotFoundException(`الإعداد '${key}' غير موجود`);
    return s;
  }

  async update(key: string, dto: UpdateSettingDto) {
    await this.findByKey(key);
    return this.prisma.setting.update({ where: { key }, data: { value: dto.value } });
  }

  async bulkUpdate(settings: SettingEntryDto[]) {
    return this.prisma.$transaction(
      settings.map((s) =>
        this.prisma.setting.upsert({
          where: { key: s.key },
          update: { value: s.value },
          create: { key: s.key, value: s.value, type: 'STRING' },
        }),
      ),
    );
  }
}
