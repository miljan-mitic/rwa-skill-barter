import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserSkillDto {
  @IsOptional()
  @IsString({ message: 'DESCRIPTION_WRONG_TYPE' })
  @IsNotEmpty({ message: 'DESCRIPTION_EMPTY' })
  @Expose()
  description?: string;
}
