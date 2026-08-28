import {
  IsArray, IsBoolean, IsEnum, IsInt, IsOptional,
  IsString, IsUrl, Max, MaxLength, Min, MinLength,
} from 'class-validator';
import { PostStatus } from '@prisma/client';

export class CreatePostDto {
  @IsString() @MinLength(5) title: string;
  @IsString() @IsOptional() titleEn?: string;
  @IsString() @MinLength(3) slug: string;
  @IsString() @MinLength(10) description: string;
  @IsString() content: string;
  @IsString() @MaxLength(160) metaDescription: string;
  @IsArray() @IsString({ each: true }) @IsOptional() keywords?: string[];
  @IsArray() @IsString({ each: true }) @IsOptional() tags?: string[];
  @IsUrl() @IsOptional() heroImageUrl?: string;
  @IsString() @IsOptional() heroImageAlt?: string;
  @IsInt() @Min(1) @IsOptional() readingTime?: number;
  @IsEnum(PostStatus) @IsOptional() status?: PostStatus;
  @IsBoolean() @IsOptional() featured?: boolean;
  @IsString() categoryId: string;
}

export class UpdatePostDto {
  @IsString() @MinLength(5) @IsOptional() title?: string;
  @IsString() @IsOptional() titleEn?: string;
  @IsString() @IsOptional() slug?: string;
  @IsString() @IsOptional() description?: string;
  @IsString() @IsOptional() content?: string;
  @IsString() @MaxLength(160) @IsOptional() metaDescription?: string;
  @IsArray() @IsString({ each: true }) @IsOptional() keywords?: string[];
  @IsArray() @IsString({ each: true }) @IsOptional() tags?: string[];
  @IsUrl() @IsOptional() heroImageUrl?: string;
  @IsString() @IsOptional() heroImageAlt?: string;
  @IsInt() @Min(1) @IsOptional() readingTime?: number;
  @IsEnum(PostStatus) @IsOptional() status?: PostStatus;
  @IsBoolean() @IsOptional() featured?: boolean;
  @IsString() @IsOptional() categoryId?: string;
}

export class PostQueryDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsEnum(PostStatus) status?: PostStatus;
  @IsOptional() @IsString() categorySlug?: string;
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @IsInt() @Min(1) @Max(100) limit?: number = 10;
}
