import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  Validate,
} from 'class-validator';
import { OFFER_MEETING } from 'src/common/constants/offer-meeting.const';
import { FutureDate } from 'src/common/validators/future-date.validator';

export class CreateBarterDto {
  @IsDefined({ message: 'START_TIME_REQUIRED' })
  @IsNotEmpty({ message: 'START_TIME_EMPTY' })
  @Type(() => Date)
  @IsDate({ message: 'START_TIME_WRONG_TYPE' })
  @Validate(FutureDate, {
    message: `START_TIME_MUST_BE_AT_LEAST_${OFFER_MEETING.AT.BUFFER_MINUTES}_MINUTES_IN_FUTURE`,
  })
  @Expose()
  startTime: Date;

  @IsDefined({ message: 'END_TIME_REQUIRED' })
  @IsNotEmpty({ message: 'END_TIME_EMPTY' })
  @Type(() => Date)
  @IsDate({ message: 'END_TIME_WRONG_TYPE' })
  @Validate(FutureDate, {
    message: `END_TIME_MUST_BE_AT_LEAST_${OFFER_MEETING.DURATION.MIN}_MINUTES_IN_FUTURE`,
  })
  @Expose()
  endTime: Date;

  @IsDefined({ message: 'OFFER_REQUEST_ID_REQUIRED' })
  @IsNotEmpty({ message: 'OFFER_REQUEST_ID_EMPTY' })
  @Type(() => Number)
  @IsNumber({}, { message: 'OFFER_REQUEST_ID_WRONG_TYPE' })
  @Expose()
  offerRequestId: number;
}
