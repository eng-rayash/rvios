import { Type } from 'class-transformer';
import {
  ArrayMaxSize, IsArray, IsBoolean, IsEnum, IsInt, IsOptional,
  IsString, IsUrl, Matches, Max, MaxLength, Min, MinLength, ValidateNested,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { MetricDirection, ProjectStatus } from '@prisma/client';

export class ProjectMetricDto {
  @IsString() @MinLength(1) @MaxLength(60) label: string;
  @IsString() @MinLength(1) @MaxLength(20) value: string;
  @IsOptional() @IsString() @MaxLength(20) unit?: string;
  @IsOptional() @IsEnum(MetricDirection) direction?: MetricDirection;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) order?: number;
}

export class ApproachStepDto {
  @IsString() @MinLength(1) @MaxLength(120) title: string;
  @IsString() @MaxLength(600) desc: string;
}

export class CreateProjectDto {
  /* حروف لاتينية صغيرة وأرقام وشرطات فقط: الـ slug يدخل في الرابط
     وفي sitemap، والعربية فيه تُرمَّز فتصير غير مقروءة. */
  @IsString()
  @MinLength(2)
  @MaxLength(90)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'الرابط يقبل الحروف اللاتينية الصغيرة والأرقام والشرطات فقط',
  })
  slug: string;

  @IsString() @MinLength(2) @MaxLength(140) title: string;
  @IsOptional() @IsString() @MaxLength(140) titleEn?: string;
  @IsString() @MinLength(10) @MaxLength(200) summary: string;
  @IsString() @MinLength(20) description: string;

  @IsOptional() @IsString() challenge?: string;
  @IsOptional() @IsString() solution?: string;
  @IsOptional() @IsString() outcome?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12)
  @ValidateNested({ each: true })
  @Type(() => ApproachStepDto)
  approach?: ApproachStepDto[];

  @IsOptional() @IsString() @MaxLength(120) client?: string;
  @IsOptional() @IsUrl() clientLogoUrl?: string;
  @IsOptional() @IsString() @MaxLength(80) industry?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1990) @Max(2100) year?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(120) durationMonths?: number;
  @IsOptional() @IsString() @MaxLength(120) role?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(500) teamSize?: number;

  @IsOptional() @IsArray() @ArrayMaxSize(30) @IsString({ each: true }) technologies?: string[];
  @IsOptional() @IsString() categoryId?: string;
  @IsOptional() @IsArray() @ArrayMaxSize(10) @IsString({ each: true }) serviceIds?: string[];

  @IsOptional() @IsUrl() coverImageUrl?: string;
  @IsOptional() @IsString() @MaxLength(200) coverImageAlt?: string;
  @IsOptional() @IsString() coverBlurHash?: string;

  @IsOptional() @IsString() @MaxLength(600) testimonialQuote?: string;
  @IsOptional() @IsString() @MaxLength(120) testimonialAuthor?: string;
  @IsOptional() @IsString() @MaxLength(120) testimonialRole?: string;
  @IsOptional() @IsUrl() testimonialAvatarUrl?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(8)
  @ValidateNested({ each: true })
  @Type(() => ProjectMetricDto)
  metrics?: ProjectMetricDto[];

  @IsOptional() @IsUrl() liveUrl?: string;
  @IsOptional() @IsUrl() repoUrl?: string;
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) order?: number;
  @IsOptional() @IsEnum(ProjectStatus) status?: ProjectStatus;

  @IsOptional() @IsString() @MaxLength(70) metaTitle?: string;
  @IsOptional() @IsString() @MaxLength(160) metaDescription?: string;
  @IsOptional() @IsUrl() ogImageUrl?: string;
}

/**
 * كل الحقول اختيارية، ونفس قيود الإنشاء تبقى مطبَّقة على ما يُرسَل فعلاً.
 * `PartialType` ينسخ الديكوريتورات — بخلاف `Partial<T>` الذي يعمل على
 * مستوى الأنواع فقط فيُسقِط التحقّق كلياً وقت التشغيل.
 */
export class UpdateProjectDto extends PartialType(CreateProjectDto) {}

export class ProjectImageDto {
  @IsUrl() url: string;
  @IsOptional() @IsString() @MaxLength(200) alt?: string;
  @IsOptional() @IsString() @MaxLength(300) caption?: string;
  @IsOptional() @Type(() => Number) @IsInt() width?: number;
  @IsOptional() @Type(() => Number) @IsInt() height?: number;
  @IsOptional() @IsString() blurHash?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) order?: number;
}

export class AddImagesDto {
  @IsArray()
  @ArrayMaxSize(40)
  @ValidateNested({ each: true })
  @Type(() => ProjectImageDto)
  images: ProjectImageDto[];
}

export class ReorderItemDto {
  @IsString() id: string;
  @Type(() => Number) @IsInt() @Min(0) order: number;
}

export class ReorderDto {
  @IsArray()
  @ArrayMaxSize(200)
  @ValidateNested({ each: true })
  @Type(() => ReorderItemDto)
  items: ReorderItemDto[];
}
