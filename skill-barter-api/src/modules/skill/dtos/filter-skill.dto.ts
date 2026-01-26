import { Expose, Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { PaginationParams } from 'src/common/dtos/pagination-params.dto';

export class FilterSkillDto extends PaginationParams {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'CATEGORY_ID_WRONG_TYPE' })
  @Expose()
  categoryId?: number;
}
