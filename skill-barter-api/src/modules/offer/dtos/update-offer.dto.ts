import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OFFER_MEETING_TYPE } from 'src/common/enums/offer-meeting-type.enum';
import { OFFER_STATUS } from 'src/common/enums/offer-status.enum';

export class UpdateOfferDto {
  @IsOptional()
  @IsString({ message: 'TITLE_WRONG_TYPE' })
  @IsNotEmpty({ message: 'TITLE_EMPTY' })
  @Expose()
  title?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'MEETING_TYPE_EMPTY' })
  @IsEnum(OFFER_MEETING_TYPE, { message: 'MEETING_TYPE_WRONG_TYPE' })
  @Expose()
  meetingType?: OFFER_MEETING_TYPE;

  @IsOptional()
  @IsString({ message: 'DESCRIPTION_WRONG_TYPE' })
  @Expose()
  description?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'STATUS_EMPTY' })
  @IsEnum(OFFER_STATUS, { message: 'STATUS_WRONG_TYPE' })
  @Expose()
  status?: OFFER_STATUS;
}
