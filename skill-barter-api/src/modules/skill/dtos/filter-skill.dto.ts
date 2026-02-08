import { Expose, Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { PaginationParams } from 'src/common/dtos/pagination-params.dto';

export class FilterSkillDto extends PaginationParams {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'CATEGORY_ID_WRONG_TYPE' })
  @Expose()
  categoryId?: number;

  @IsOptional()
  @Transform(({ value }) => value && (value === 'true' || value === true))
  @IsBoolean({ message: 'USER_SKILLS_WRONG_TYPE' })
  @Expose()
  userSkills?: boolean;
}
