import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';
import * as bcrypt from 'bcrypt';
import { AuthSignupDto } from '../dtos/auth-signup.dto';
import { User } from 'src/entities/user.entity';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigurationService } from 'src/modules/configuration/services/configuration.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configurationService: ConfigurationService,
  ) {}

  async validateUser(email: string, password: string) {
    let user: User;
    try {
      user = await this.userService.getUserByEmail(email, true);
    } catch (error) {
      console.warn('AUTH SERVICE - VALIDATE USER:', error);
      throw new InternalServerErrorException('Unexpected error');
    }
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }

    let isMatch: boolean;
    try {
      isMatch = await bcrypt.compare(password, user.password);
    } catch (error) {
      console.warn('AUTH SERVICE - BCRYPT COMPARE:', error);
      throw new InternalServerErrorException('Unexpected error');
    }
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    delete user.password;
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
      secret: this.configurationService.get('JWT_ACCESS_SECRET_KEY'),
      expiresIn: this.configurationService.get('JWT_ACCESS_EXPIRATION_TIME'),
    });

    return { user, accessToken };
  }
}
