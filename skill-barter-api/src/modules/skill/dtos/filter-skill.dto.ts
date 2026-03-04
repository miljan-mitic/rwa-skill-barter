import { Expose, Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { createPaginationParamsDto } from 'src/common/dtos/pagination-params.dto';
import { Skill } from 'src/entities/skill.entity';

export class FilterSkillDto extends createPaginationParamsDto(Skill) {
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
