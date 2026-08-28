import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

/**
 * الأساس الذي ترثه كل استعلامات القوائم.
 *
 * الحدّ الأعلى ليس تجميلاً: بدونه `?limit=999999` يسحب الجدول كاملاً
 * في طلب واحد.
 */
export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order: 'asc' | 'desc' = 'desc';

  get skip() {
    return (this.page - 1) * this.limit;
  }
}

export interface Paginated<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
  };
}

export function paginate<T>(
  data: T[],
  total: number,
  { page, limit }: { page: number; limit: number },
): Paginated<T> {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    data,
    meta: { total, page, limit, totalPages, hasNext: page < totalPages },
  };
}
