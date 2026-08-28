import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

const SORTABLE = ['order', 'publishedAt', 'views', 'year', 'title'] as const;

export class QueryProjectsDto extends PaginationQueryDto {
  /* المعرض شبكة بصرية — 48 بطاقة أقصى حدّ معقول للصفحة الواحدة */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(48)
  override limit: number = 12;

  @IsOptional()
  @IsIn(SORTABLE)
  override sort: string = 'order';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  override order: 'asc' | 'desc' = 'asc';

  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() service?: string;
  @IsOptional() @IsString() tech?: string;
  @IsOptional() @IsString() industry?: string;
  @IsOptional() @IsString() search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1990)
  year?: number;

  /* `?featured` و`?featured=true` كلاهما يعني «نعم» — سلوك الروابط الطبيعي */
  @IsOptional()
  @Transform(({ value }) => value === '' || value === 'true' || value === true)
  @IsBoolean()
  featured?: boolean;
}
