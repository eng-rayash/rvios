import { Injectable, NotFoundException } from '@nestjs/common';
import { ContactStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateContactDto {
  @IsString() @MinLength(2) name: string;
  @IsEmail() email: string;
  @IsString() @IsOptional() phone?: string;
  @IsString() @IsOptional() service?: string;
  @IsString() @MinLength(10) message: string;
}

export class UpdateContactStatusDto {
  @IsEnum(ContactStatus) status: ContactStatus;
}

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const c = await this.prisma.contact.findUnique({ where: { id } });
    if (!c) throw new NotFoundException('الرسالة غير موجودة');
    return c;
  }

  create(dto: CreateContactDto) {
    return this.prisma.contact.create({ data: dto });
  }

  async updateStatus(id: string, dto: UpdateContactStatusDto) {
    await this.findOne(id);
    return this.prisma.contact.update({ where: { id }, data: { status: dto.status } });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.contact.delete({ where: { id } });
    return { message: 'تم حذف الرسالة' };
  }

  stats() {
    return this.prisma.contact.groupBy({
      by: ['status'],
      _count: { status: true },
    });
  }
}
