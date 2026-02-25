import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  Validate,
} from 'class-validator';
import { OFFER_MEETING } from 'src/common/constants/offer-meeting.const';
import { OFFER_MEETING_TYPE } from 'src/common/enums/offer-meeting-type.enum';
import { FutureDate } from 'src/common/validators/future-date.validator';

export class CreateOfferDto {
  @IsDefined({ message: 'TITLE_REQUIRED' })
  @IsString({ message: 'TITLE_WRONG_TYPE' })
  @IsNotEmpty({ message: 'TITLE_EMPTY' })
  @Expose()
  title?: string;

  @IsDefined({ message: 'USER_SKILL_ID_REQUIRED' })
  @IsNotEmpty({ message: 'USER_SKILL_ID_EMPTY' })
  @Type(() => Number)
  @IsNumber({}, { message: 'USER_SKILL_ID_WRONG_TYPE' })
  @Expose()
  userSkillId: number;

  @IsOptional()
  @IsEnum(OFFER_MEETING_TYPE, { message: 'MEETING_WRONG_TYPE' })
  @Expose()
  meetingType?: OFFER_MEETING_TYPE;

  @IsOptional()
  @IsString({ message: 'DESCRIPTION_WRONG_TYPE' })
  @IsNotEmpty({ message: 'DESCRIPTION_EMPTY' })
  @Expose()
  description?: string;

  @IsDefined({ message: 'MEETING_AT_REQUIRED' })
  @IsNotEmpty({ message: 'MEETING_AT_EMPTY' })
  @Type(() => Date)
  @IsDate({ message: 'MEETING_AT_WRONG_TYPE' })
  @Validate(FutureDate, {
    message: `MEETING_AT_MUST_BE_AT_LEAST_${OFFER_MEETING.AT.BUFFER_MINUTES}_MINUTES_IN_FUTURE`,
  })
  @Expose()
  meetingAt: Date;

  @IsDefined({ message: 'DURATION_MINUTES_REQUIRED' })
  @IsNotEmpty({ message: 'DURATION_MINUTES_EMPTY' })
  @Type(() => Number)
  @IsInt({ message: 'DURATION_MINUTES_WRONG_TYPE' })
  @Min(45, { message: 'DURATION_MINUTES_MINIMUM_45' })
  @Max(180, { message: 'DURATION_MINUTES_MAXIMUM_180' })
  @Expose()
  durationMinutes: number;
}
