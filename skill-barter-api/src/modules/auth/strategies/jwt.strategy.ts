import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { User } from 'src/models/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET_KEY') || '',
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    try {
      const { userId } = payload;
      const user = await this.userService.getUserById(userId);
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      console.warn('JWT STRATEGY:', error);
      throw new UnauthorizedException('You are failed on jwt validation');
    }
  }
}
