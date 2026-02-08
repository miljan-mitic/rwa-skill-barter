import { Expose, Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserSkillDto {
  @IsDefined({ message: 'SKILL_ID_REQUIRED' })
  @Type(() => Number)
  @IsNumber({}, { message: 'SKILL_ID_WRONG_TYPE' })
  @IsNotEmpty({ message: 'SKILL_ID_EMPTY' })
  @Expose()
  skillId: number;

  @IsOptional()
  @IsString({ message: 'DESCRIPTION_WRONG_TYPE' })
  @IsNotEmpty({ message: 'DESCRIPTION_EMPTY' })
  @Expose()
  description: string;
}
