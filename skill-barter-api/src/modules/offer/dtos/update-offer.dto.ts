import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OFFER_MEETING_TYPE } from 'src/common/enums/offer-meeting-type.enum';

export class UpdateOfferDto {
  @IsOptional()
  @IsString({ message: 'TITLE_WRONG_TYPE' })
  @IsNotEmpty({ message: 'TITLE_EMPTY' })
  @Expose()
  title?: string;

  @IsOptional()
  @IsEnum(OFFER_MEETING_TYPE, { message: 'MEETING_WRONG_TYPE' })
  @Expose()
  meetingType?: OFFER_MEETING_TYPE;

  @IsOptional()
  @IsString({ message: 'DESCRIPTION_WRONG_TYPE' })
  @IsNotEmpty({ message: 'DESCRIPTION_EMPTY' })
  @Expose()
  description?: string;
}
