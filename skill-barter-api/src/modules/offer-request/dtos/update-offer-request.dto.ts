import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { OFFER_REQUEST_STATUS } from 'src/common/enums/offer-request-status.enum';

export class UpdateOfferRequestDto {
  @IsOptional()
  @IsNotEmpty({ message: 'STATUS_EMPTY' })
  @IsEnum(OFFER_REQUEST_STATUS, { message: 'STATUS_WRONG_TYPE' })
  @Expose()
  status?: OFFER_REQUEST_STATUS;
}
