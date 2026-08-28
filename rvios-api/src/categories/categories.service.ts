import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString() @MinLength(2) name: string;
  @IsString() @MinLength(2) nameEn: string;
  @IsString() @MinLength(2) slug: string;
}

export class UpdateCategoryDto {
  @IsString() @MinLength(2) name?: string;
  @IsString() @MinLength(2) nameEn?: string;
  @IsString() @MinLength(2) slug?: string;
}

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const cat = await this.prisma.category.findUnique({ where: { id }, include: { _count: { select: { posts: true } } } });
    if (!cat) throw new NotFoundException('التصنيف غير موجود');
    return cat;
  }

  async create(dto: CreateCategoryDto) {
    const exists = await this.prisma.category.findUnique({ where: { slug: dto.slug } });
    if (exists) throw new ConflictException('الرابط (slug) مستخدم');
    return this.prisma.category.create({ data: dto });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.category.delete({ where: { id } });
    return { message: 'تم حذف التصنيف' };
  }
}
