import { Expose, Transform, Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsDefined, IsNumber } from 'class-validator';

export class BarterMeetingsStatesDto {
  @IsDefined({ message: 'IDS_REQUIRED' })
  @ArrayNotEmpty({ message: 'IDS_EMPTY' })
  @IsArray({ message: 'IDS_ARRAY' })
  @IsNumber({}, { each: true, message: 'IDS_WRONG_TYPE' })
  @Type(() => Number)
  @Transform(({ value }) => {
    if (!Array.isArray(value)) {
      return [Number(value)];
    }
    return value.map((v) => Number(v));
  })
  @Expose()
  ids: number[];
}
