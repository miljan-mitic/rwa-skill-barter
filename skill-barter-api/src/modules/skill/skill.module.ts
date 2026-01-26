import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from 'src/entities/skill.entity';
import { SkillService } from './services/skill.service';
import { SkillController } from './controllers/skill.controller';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Skill]), CategoryModule],
  providers: [SkillService],
  controllers: [SkillController],
  exports: [SkillService],
})
export class SkillModule {}
