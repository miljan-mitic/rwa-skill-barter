import { Expose, Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { createPaginationParamsDto } from 'src/common/dtos/pagination-params.dto';
import { OFFER_REQUEST_STATUS } from 'src/common/enums/offer-request-status.enum';
import { OfferRequest } from 'src/entities/offer-request.entity';

export class FilterOfferRequestDto extends createPaginationParamsDto(
  OfferRequest,
) {
  @IsOptional()
  @IsNotEmpty({ message: 'OFFER_ID_EMPTY' })
  @Type(() => Number)
  @IsNumber({}, { message: 'OFFER_ID_WRONG_TYPE' })
  @Expose()
  offerId?: number;

  @IsOptional()
  @IsNotEmpty({ message: 'SKILL_ID_EMPTY' })
  @Type(() => Number)
  @IsNumber({}, { message: 'SKILL_ID_WRONG_TYPE' })
  @Expose()
  skillId?: number;

  @IsOptional()
  @IsNotEmpty({ message: 'STATUS_EMPTY' })
  @IsEnum(OFFER_REQUEST_STATUS, { message: 'STATUS_WRONG_TYPE' })
  @Expose()
  status?: OFFER_REQUEST_STATUS;
}
