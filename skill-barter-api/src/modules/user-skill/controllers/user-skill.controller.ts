import {
  Body,
  Controller,
  Get,
  Param,
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

@Controller('user-skills')
export class UserSkillController {
  constructor(private readonly userSkillService: UserSkillService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createUserSkillDto: CreateUserSkillDto,
    @UserDecorator() user: User,
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
}
