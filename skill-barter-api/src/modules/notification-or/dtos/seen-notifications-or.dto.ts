import { Expose, Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ExactlyOne } from 'src/common/validators/exactly-one.validator';

@ExactlyOne(['ids', 'markAll'], {
  message: 'PROVIDE_EITHER_IDS_OR_MARK_ALL_BUT_NOT_BOTH',
})
export class SeenNotificationsOR {
  @IsOptional()
  @ArrayNotEmpty({ message: 'IDS_EMPTY' })
  @IsArray({ message: 'IDS_ARRAY' })
  @IsNumber({}, { each: true, message: 'IDS_WRONG_TYPE' })
  @Type(() => Number)
  @Expose()
  ids?: number[];

  @IsOptional()
  @Transform(({ value }) => value && (value === 'true' || value === true))
  @IsBoolean({ message: 'MARK_ALL_WRONG_TYPE' })
  @Expose()
  markAll?: boolean;
}
