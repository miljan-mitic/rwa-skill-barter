import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSkill } from 'src/entities/user-skill.entity';
import { UserSkillController } from './controllers/user-skill.controller';
import { UserSkillService } from './services/user-skill.service';
import { SkillModule } from '../skill/skill.module';
import { OfferModule } from '../offer/offer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSkill]),
    SkillModule,
    forwardRef(() => OfferModule),
  ],
  providers: [UserSkillService],
  controllers: [UserSkillController],
  exports: [UserSkillService],
})
export class UserSkillModule {}
