import { Expose, Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOfferRequestDto {
  @IsOptional({ message: 'USER_SKILL_ID_REQUIRED' })
  @IsNotEmpty({ message: 'USER_SKILL_ID_EMPTY' })
  @Type(() => Number)
  @IsNumber({}, { message: 'USER_SKILL_ID_WRONG_TYPE' })
  @Expose()
  userSkillId: number;

  @IsDefined({ message: 'OFFER_ID_REQUIRED' })
  @IsNotEmpty({ message: 'OFFER_ID_EMPTY' })
  @Type(() => Number)
  @IsNumber({}, { message: 'OFFER_ID_WRONG_TYPE' })
  @Expose()
  offerId: number;

  @IsOptional()
  @IsNotEmpty({ message: 'MESSAGE_ID_EMPTY' })
  @IsString({ message: 'MESSAGE_ID_WRONG_TYPE' })
  @Expose()
  message?: string;
}
