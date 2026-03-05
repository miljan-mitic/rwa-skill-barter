import { Expose, Type } from 'class-transformer';
import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @IsDefined({ message: 'BARTER_ID_REQUIRED' })
  @IsNotEmpty({ message: 'BARTER_ID_EMPTY' })
  @Type(() => Number)
  @IsNumber({}, { message: 'BARTER_ID_WRONG_TYPE' })
  @Expose()
  barterId: number;

  @IsDefined({ message: 'RATING_REQUIRED' })
  @IsNotEmpty({ message: 'RATING_EMPTY' })
  @Type(() => Number)
  @IsInt({ message: 'RATING_WRONG_TYPE' })
  @Min(1, { message: 'RATING_MINIMUM_1' })
  @Max(5, { message: 'RATING_MAXIMUM_5' })
  @Expose()
  rating: number;

  @IsOptional()
  @IsString({ message: 'COMMENT_WRONG_TYPE' })
  @IsNotEmpty({ message: 'COMMENT_EMPTY' })
  @Expose()
  comment?: string;
}
