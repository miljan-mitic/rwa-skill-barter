import { Expose } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { REGULAR_EXPRESSIONS } from 'src/common/constants/regular-expressions.const';

export class AuthSignupDto {
  @IsDefined({ message: 'EMAIL_REQUIRED' })
  @IsEmail({}, { message: 'EMAIL_INVALID' })
  @Expose()
  email: string;

  @IsDefined({ message: 'USERNAME_REQUIRED' })
  @IsString({ message: 'USERNAME_WRONG_TYPE' })
  @IsNotEmpty({ message: 'USERNAME_EMPTY' })
  @MinLength(4, { message: 'USERNAME_TOO_SHORT' })
  @MaxLength(30, { message: 'USERNAME_TOO_LONG' })
  @Expose()
  username: string;

  @IsDefined({ message: 'PASSWORD_REQUIRED' })
  @IsString({ message: 'PASSWORD_WRONG_TYPE' })
  @IsNotEmpty({ message: 'PASSWORD_EMPTY' })
  @Matches(REGULAR_EXPRESSIONS.PASSWORD, {
    message: 'PASSWORD_TOO_WEAK',
  })
  @Expose()
  readonly password: string;

  @IsOptional()
  @IsString({ message: 'PROFILE_PICTURE_WRONG_TYPE' })
  @IsNotEmpty({ message: 'PROFILE_PICTURE_EMPTY' })
  @Expose()
  profilePicture?: string;
}
