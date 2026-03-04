import { Expose, Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { createPaginationParamsDto } from 'src/common/dtos/pagination-params.dto';
import { UserSkill } from 'src/entities/user-skill.entity';

export class FilterUserSkillDto extends createPaginationParamsDto(UserSkill) {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'USER_ID_WRONG_TYPE' })
  @Expose()
  userId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'SKILL_ID_WRONG_TYPE' })
  @Expose()
  skillId?: number;
}
