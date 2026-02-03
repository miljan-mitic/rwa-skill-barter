import {
  IsOptional,
  IsNumber,
  Min,
  IsEnum,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { SortBy, SortType } from '../enums/sort.enum';

export class PaginationParams {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Expose()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Expose()
  pageSize?: number;

  @IsOptional()
  @IsEnum(SortBy)
  @Expose()
  sortBy?: SortBy;

  @IsOptional()
  @IsEnum(SortType)
  @Expose()
  sortType?: SortType;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Expose()
  search?: string;
}
