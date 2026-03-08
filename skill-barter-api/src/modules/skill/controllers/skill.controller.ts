import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SkillService } from '../services/skill.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreateSkillDto } from '../dtos/create-skill.dto';
import { FilterSkillDto } from '../dtos/filter-skill.dto';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { User } from 'src/entities/user.entity';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { ROLE } from 'src/common/enums/role.enum';

@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Roles([ROLE.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillService.create(createSkillDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getSkills(
    @UserDecorator() user: User,
    @Query() filterSkillDto: FilterSkillDto,
  ) {
    return this.skillService.getSkills(user, filterSkillDto);
  }

  @Roles([ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteSkill(@Param('id', ParseIntPipe) id: number) {
    return this.skillService.deleteSkill(id);
  }
}
