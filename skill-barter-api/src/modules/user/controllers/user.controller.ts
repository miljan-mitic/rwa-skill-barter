import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from 'src/entities/user.entity';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { ROLE } from 'src/common/enums/role.enum';
import { FilterUserDto } from 'src/modules/user/dtos/filter-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles([ROLE.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  getUsers(@Query() filterUserDto: FilterUserDto) {
    return this.userService.getUsers(filterUserDto);
  }

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
