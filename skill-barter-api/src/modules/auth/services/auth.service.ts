import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';
import * as bcrypt from 'bcrypt';
import { AuthSignupDto } from '../dtos/auth-signup.dto';
import { User } from 'src/models/entities/user.entity';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    } else if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async signUp(
    authSignupDto: AuthSignupDto,
  ): Promise<{ user: User; accessToken: string }> {
    const user = await this.userService.createUser(authSignupDto);
    return this.login(user);
  }

  async login(user: User): Promise<{ user: User; accessToken: string }> {
    const { id: userId, email, role } = user;
    const payload: JwtPayload = {
      userId,
      email,
      role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET_KEY'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION_TIME'),
    });

    return { user, accessToken };
  }
}
