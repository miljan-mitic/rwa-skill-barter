import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationParams } from 'src/common/dtos/pagination-params.dto';

export class FilterCategoryDto extends PaginationParams {
  @IsOptional()
  @IsString({ message: 'NAME_WRONG_TYPE' })
  @IsNotEmpty({ message: 'NAME_EMPTY' })
  @Expose()
  name?: string;
}
