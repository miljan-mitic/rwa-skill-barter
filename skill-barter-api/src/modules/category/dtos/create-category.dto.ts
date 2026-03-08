import { Expose } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCategoryDto {
  @IsDefined({ message: 'NAME_REQUIRED' })
  @IsString({ message: 'NAME_WRONG_TYPE' })
  @IsNotEmpty({ message: 'NAME_EMPTY' })
  @MaxLength(30, { message: 'NAME_TOO_LONG' })
  @Expose()
  name: string;

  @IsOptional()
  @IsString({ message: 'DESCRIPTION_WRONG_TYPE' })
  @IsNotEmpty({ message: 'DESCRIPTION_EMPTY' })
  @Expose()
  description: string;
}
