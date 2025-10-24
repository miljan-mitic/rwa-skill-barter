import { Controller } from '@nestjs/common';
import { SkillService } from '../services/skill.service';

@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}
}
