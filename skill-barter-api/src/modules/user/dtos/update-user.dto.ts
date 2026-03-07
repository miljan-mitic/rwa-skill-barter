import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  Matches,
  IsNotEmpty,
  MaxLength,
  ValidateIf,
  IsDefined,
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
  @IsString({ message: 'NEW_PASSWORD_WRONG_TYPE' })
  @IsNotEmpty({ message: 'NEW_PASSWORD_EMPTY' })
  @Matches(REGULAR_EXPRESSIONS.PASSWORD, {
    message: 'NEW_PASSWORD_TOO_WEAK',
  })
  @Expose()
  newPassword?: string;

  @ValidateIf((o) => o.newPassword)
  @IsDefined({ message: 'CURRENT_PASSWORD_IS_REQUIRED_WHEN_CHANGING_PASSWORD' })
  @IsString({ message: 'CURRENT_PASSWORD_WRONG_TYPE' })
  @IsNotEmpty({ message: 'CURRENT_PASSWORD_EMPTY' })
  @Expose()
  currentPassword?: string;
}
