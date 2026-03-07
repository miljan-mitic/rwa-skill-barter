import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AuthSignupDto } from 'src/modules/auth/dtos/auth-signup.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { removeUndefinedAttributes } from 'src/common/utils/remove-undefined-attributes';

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
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async addNewRating(userId: number, rating: number) {
    const user = await this.getUserById(userId);

    const { ratingAvg, ratingCount } = user;

    const newRatingCount = ratingCount + 1;
    const newRatingAvg = (ratingAvg * ratingCount + rating) / newRatingCount;

    user.ratingCount = newRatingCount;
    user.ratingAvg = newRatingAvg;

    try {
      await this.userRepository.save(user);
      return true;
    } catch (error) {
      console.warn('USER SERVICE - ADD NEW RATING:', error);
      return false;
    }
  }

  async updateUser(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    const { newPassword, currentPassword, ...updateUserData } = updateUserDto;
    if (newPassword && currentPassword) {
      const userWithPassword = await this.getUserByEmail(user.email, true);

      const isMatch = await bcrypt.compare(
        currentPassword,
        userWithPassword.password,
      );
      if (!isMatch) {
        throw new BadRequestException('Wrong password');
      }

      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(newPassword, salt);
    }

    const filteredDto = removeUndefinedAttributes(updateUserData);
    Object.assign(user, filteredDto);

    try {
      const saved = await this.userRepository.save(user);
      delete saved.password;
      return saved;
    } catch (error) {
      console.warn('USER SERVICE - UPDATE USER:', error);
      if (error.code === '23505') {
        throw new ConflictException('Username or Email already exists');
      }
      throw new InternalServerErrorException('Unexpected error');
    }
  }
}
