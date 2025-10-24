import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AuthSignupDto } from 'src/modules/auth/dtos/auth-signup.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(authSignupDto: AuthSignupDto): Promise<User> {
    const { password } = authSignupDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      ...authSignupDto,
      password: hashedPassword,
    });

    try {
      const savedUser = await this.userRepository.save(user);
      delete savedUser.password;
      return savedUser;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username or Email already exists');
      } else {
        console.warn('DATABASE:', error);
        throw new InternalServerErrorException('Unexpected error');
      }
    }
  }

  async getUserByEmail(email: string, includePassword = false): Promise<User> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email });

    if (includePassword) {
      query.addSelect('user.password');
    }

    return query.getOne();
  }

  async getUserById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }
}
