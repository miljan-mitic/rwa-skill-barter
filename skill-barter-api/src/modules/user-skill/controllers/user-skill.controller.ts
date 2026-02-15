import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserSkillService } from '../services/user-skill.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { CreateUserSkillDto } from '../dtos/create-user-skill.dto';
import { User } from 'src/entities/user.entity';
import { FilterUserSkillDto } from '../dtos/filter-user-skill.dto';
import { UpdateUserSkillDto } from '../dtos/update-user-skill.dto';

@Controller('user-skills')
export class UserSkillController {
  constructor(private readonly userSkillService: UserSkillService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @UserDecorator() user: User,
    @Body() createUserSkillDto: CreateUserSkillDto,
  ) {
    return this.userSkillService.create(user, createUserSkillDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getUserSkills(
    @UserDecorator() user: User,
    @Query() filterUserSkillDto: FilterUserSkillDto,
  ) {
    return this.userSkillService.getUserSkills(user, filterUserSkillDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getUserSkillById(@UserDecorator() user: User, @Param('id') id: number) {
    return this.userSkillService.getUserSkillById(user, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateUserSkill(
    @UserDecorator() user: User,
    @Param('id') id: number,
    @Body() updateUserSkillDto: UpdateUserSkillDto,
  ) {
    return this.userSkillService.updateUserSkill(user, id, updateUserSkillDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteUserSkill(@UserDecorator() user: User, @Param('id') id: number) {
    return this.userSkillService.deleteUserSkill(user, id);
  }
}
