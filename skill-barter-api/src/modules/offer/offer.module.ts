import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from 'src/entities/offer.entity';
import { OfferService } from './services/offer.service';
import { OfferController } from './controllers/offer.controller';
import { UserSkillModule } from '../user-skill/user-skill.module';

@Module({
  imports: [TypeOrmModule.forFeature([Offer]), UserSkillModule],
  providers: [OfferService],
  controllers: [OfferController],
  exports: [OfferService],
})
export class OfferModule {}
