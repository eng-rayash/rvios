import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class UpdateSettingDto {
  @IsString()
  @MaxLength(10_000)
  value: string;
}

export class SettingEntryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  key: string;

  @IsString()
  @MaxLength(10_000)
  value: string;
}

export class BulkUpdateSettingsDto {
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => SettingEntryDto)
  settings: SettingEntryDto[];
}
