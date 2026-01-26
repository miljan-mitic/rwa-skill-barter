import { Expose, Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { PaginationParams } from 'src/common/dtos/pagination-params.dto';

export class FilterUserSkillDto extends PaginationParams {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'SKILL_ID_WRONG_TYPE' })
  @Expose()
  skillId?: number;
}
