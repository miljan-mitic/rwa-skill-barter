import {
  IsOptional,
  IsNumber,
  Min,
  IsEnum,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { SortType } from '../enums/sort.enum';
import { IsSortableColumn } from '../validators/is-sortable-column.validator';
import { EntityTarget } from 'typeorm';
import { type SortableKeys } from '../types/sortable-keys.type';

export function createPaginationParamsDto<T>(entity: EntityTarget<T>) {
  class PaginationParamsDto {
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
    @IsSortableColumn(entity)
    @Expose()
    sortBy?: SortableKeys<T>;

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
  return PaginationParamsDto;
}
