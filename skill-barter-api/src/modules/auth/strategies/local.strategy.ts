import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';
import { User } from 'src/models/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passReqToCallback: false });
  }
  async validate(email: string, password: string): Promise<User> {
    try {
      const user = await this.authService.validateUser(email, password);
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      console.warn('LOCAL STRATEGY:', error);
      throw new UnauthorizedException('You are failed on local validation');
    }
  }
}
