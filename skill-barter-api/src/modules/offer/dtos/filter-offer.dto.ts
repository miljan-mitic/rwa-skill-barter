import { Expose, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { PaginationParams } from 'src/common/dtos/pagination-params.dto';
import { OFFER_MEETING_TYPE } from 'src/common/enums/offer-meeting-type.enum';
import { OFFER_STATUS } from 'src/common/enums/offer-status.enum';

export class FilterOfferDto extends PaginationParams {
  @IsOptional()
  @Transform(({ value }) => value && (value === 'true' || value === true))
  @IsBoolean({ message: 'USER_OFFERS_WRONG_TYPE' })
  @Expose()
  userOffers?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'SKILL_ID_WRONG_TYPE' })
  @Expose()
  skillId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'CATEGORY_ID_WRONG_TYPE' })
  @Expose()
  categoryId?: number;

  @IsOptional()
  @IsNotEmpty({ message: 'STATUS_EMPTY' })
  @IsEnum(OFFER_STATUS, { message: 'STATUS_WRONG_TYPE' })
  @Expose()
  status?: OFFER_STATUS;

  @IsOptional()
  @IsNotEmpty({ message: 'MEETING_TYPE_EMPTY' })
  @IsEnum(OFFER_MEETING_TYPE, { message: 'MEETING_TYPE_WRONG_TYPE' })
  @Expose()
  meetingType?: OFFER_MEETING_TYPE;
}
