import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsArray, IsJSON, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateOwnerProfileDto {
  @IsString() @IsOptional() name?: string;
  @IsString() @IsOptional() title?: string;
  @IsString() @IsOptional() titleEn?: string;
  @IsString() @IsOptional() bio?: string;
  @IsString() @IsOptional() bioEn?: string;
  @IsUrl() @IsOptional() avatarUrl?: string;
  @IsArray() @IsString({ each: true }) @IsOptional() skills?: string[];
  @IsOptional() links?: Record<string, string>;
  @IsUrl() @IsOptional() resumeUrl?: string;
}

@Injectable()
export class OwnerService {
  constructor(private prisma: PrismaService) {}

  async getProfile() {
    const profile = await this.prisma.ownerProfile.findFirst();
    if (!profile) throw new NotFoundException('الملف الشخصي غير موجود');
    return profile;
  }

  async updateProfile(dto: UpdateOwnerProfileDto) {
    const existing = await this.prisma.ownerProfile.findFirst();

    if (existing) {
      return this.prisma.ownerProfile.update({
        where: { id: existing.id },
        data: {
          ...dto,
          links: dto.links ? (dto.links as object) : undefined,
        },
      });
    }

    // Create if doesn't exist
    return this.prisma.ownerProfile.create({
      data: {
        name: dto.name ?? '',
        title: dto.title ?? '',
        titleEn: dto.titleEn ?? '',
        bio: dto.bio ?? '',
        bioEn: dto.bioEn ?? '',
        skills: dto.skills ?? [],
        links: (dto.links ?? {}) as object,
        avatarUrl: dto.avatarUrl,
        resumeUrl: dto.resumeUrl,
      },
    });
  }
}
