import { Expose } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
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
}
