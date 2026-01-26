import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { SkillService } from '../services/skill.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreateSkillDto } from '../dtos/create-skill.dto';
import { FilterSkillDto } from '../dtos/filter-skill.dto';

@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillService.create(createSkillDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getSkills(@Query() filterSkillDto: FilterSkillDto) {
    return this.skillService.getSkills(filterSkillDto);
  }
}
