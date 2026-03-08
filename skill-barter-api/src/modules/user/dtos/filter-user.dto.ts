import { createPaginationParamsDto } from 'src/common/dtos/pagination-params.dto';
import { User } from 'src/entities/user.entity';
import { IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class FilterUserDto extends createPaginationParamsDto(User) {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'RATING_AVG_MIN_WRONG_TYPE' })
  @Min(1)
  @Max(5)
  @Expose()
  ratingAvgMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'RATING_AVG_MAX_WRONG_TYPE' })
  @Min(1)
  @Max(5)
  @Expose()
  ratingAvgMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'RATING_COUNT_MIN_WRONG_TYPE' })
  @Min(1)
  @Max(5)
  @Expose()
  ratingCountMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'RATING_COUNT_MAX_WRONG_TYPE' })
  @Min(1)
  @Max(5)
  @Expose()
  ratingCountMax?: number;
}
