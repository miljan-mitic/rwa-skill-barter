import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  Matches,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { REGULAR_EXPRESSIONS } from '../../../common/constants/regular-expressions.const';
import { Expose } from 'class-transformer';
import { USERNAME_LENGTH } from 'src/common/constants/username-length.const';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'PROFILE_PICTURE_WRONG_TYPE' })
  @IsNotEmpty({ message: 'PROFILE_PICTURE_EMPTY' })
  @Expose()
  profilePicture?: string;

  @IsOptional()
  @IsString({ message: 'USERNAME_WRONG_TYPE' })
  @IsNotEmpty({ message: 'USERNAME_EMPTY' })
  @MinLength(USERNAME_LENGTH.MIN, { message: 'USERNAME_TOO_SHORT' })
  @MaxLength(USERNAME_LENGTH.MAX, { message: 'USERNAME_TOO_LONG' })
  @Expose()
  username?: string;

  @IsOptional()
  @IsEmail({}, { message: 'EMAIL_INVALID' })
  @Expose()
  email?: string;

  @IsOptional()
  @IsString({ message: 'PASSWORD_WRONG_TYPE' })
  @IsNotEmpty({ message: 'PASSWORD_EMPTY' })
  @Matches(REGULAR_EXPRESSIONS.PASSWORD, {
    message: 'PASSWORD_TOO_WEAK',
  })
  @Expose()
  password?: string;
}
