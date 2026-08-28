import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ServiceStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  IsArray, IsEnum, IsInt, IsOptional, IsString, Min, MinLength,
} from 'class-validator';

export class CreateServiceDto {
  @IsString() @MinLength(3) title: string;
  @IsString() @MinLength(3) titleEn: string;
  @IsString() @MinLength(3) slug: string;
  @IsString() description: string;
  @IsString() descriptionEn: string;
  @IsString() @IsOptional() icon?: string;
  @IsArray() @IsString({ each: true }) @IsOptional() features?: string[];
  @IsInt() @Min(0) @IsOptional() order?: number;
  @IsEnum(ServiceStatus) @IsOptional() status?: ServiceStatus;
}

export class UpdateServiceDto {
  @IsString() @IsOptional() title?: string;
  @IsString() @IsOptional() titleEn?: string;
  @IsString() @IsOptional() slug?: string;
  @IsString() @IsOptional() description?: string;
  @IsString() @IsOptional() descriptionEn?: string;
  @IsString() @IsOptional() icon?: string;
  @IsArray() @IsString({ each: true }) @IsOptional() features?: string[];
  @IsInt() @Min(0) @IsOptional() order?: number;
  @IsEnum(ServiceStatus) @IsOptional() status?: ServiceStatus;
}

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  findAll(activeOnly = false) {
    return this.prisma.service.findMany({
      where: activeOnly ? { status: ServiceStatus.ACTIVE } : undefined,
      orderBy: { order: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    const svc = await this.prisma.service.findUnique({ where: { slug } });
    if (!svc) throw new NotFoundException('الخدمة غير موجودة');
    return svc;
  }

  async findOne(id: string) {
    const svc = await this.prisma.service.findUnique({ where: { id } });
    if (!svc) throw new NotFoundException('الخدمة غير موجودة');
    return svc;
  }

  async create(dto: CreateServiceDto) {
    const exists = await this.prisma.service.findUnique({ where: { slug: dto.slug } });
    if (exists) throw new ConflictException('الرابط مستخدم');
    return this.prisma.service.create({ data: { ...dto, features: dto.features ?? [] } });
  }

  async update(id: string, dto: UpdateServiceDto) {
    await this.findOne(id);
    return this.prisma.service.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.service.delete({ where: { id } });
    return { message: 'تم حذف الخدمة' };
  }
}
