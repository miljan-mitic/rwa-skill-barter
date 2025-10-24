import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from 'src/entities/skill.entity';
import { SkillService } from './services/skill.service';
import { SkillController } from './controllers/skill.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Skill])],
  providers: [SkillService],
  controllers: [SkillController],
})
export class SkillModule {}
