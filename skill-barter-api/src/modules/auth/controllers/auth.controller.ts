import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { User } from 'src/models/entities/user.entity';
import { AuthSignupDto } from '../dtos/auth-signup.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { UserDecorator } from 'src/common/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(
    @UserDecorator() user: User,
  ): Promise<{ user: User; accessToken: string }> {
    return this.authService.login(user);
  }

  @Post('signup')
  signUp(
    @Body() authSignupDto: AuthSignupDto,
  ): Promise<{ user: User; accessToken: string }> {
    return this.authService.signUp(authSignupDto);
  }
}
