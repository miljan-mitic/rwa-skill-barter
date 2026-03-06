import { Controller, Get, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from 'src/entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  getUser(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(
    @UserDecorator() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(user, updateUserDto);
  }
}
