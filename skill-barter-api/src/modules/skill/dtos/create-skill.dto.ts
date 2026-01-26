import { Expose, Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSkillDto {
  @IsDefined({ message: 'NAME_REQUIRED' })
  @IsString({ message: 'NAME_WRONG_TYPE' })
  @IsNotEmpty({ message: 'NAME_EMPTY' })
  @Expose()
  name: string;

  @IsOptional()
  @IsString({ message: 'DESCRIPTION_WRONG_TYPE' })
  @IsNotEmpty({ message: 'DESCRIPTION_EMPTY' })
  @Expose()
  description: string;

  @IsDefined({ message: 'CATEGORY_ID_REQUIRED' })
  @Type(() => Number)
  @IsNumber({}, { message: 'CATEGORY_ID_WRONG_TYPE' })
  @Expose()
  categoryId: number;
}
