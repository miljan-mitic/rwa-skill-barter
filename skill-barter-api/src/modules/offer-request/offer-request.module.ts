import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferRequest } from 'src/entities/offer-request.entity';
import { OfferRequestService } from './services/offer-request.service';
import { OfferRequestController } from './controllers/offer-request.controller';
import { UserSkillModule } from '../user-skill/user-skill.module';
import { OfferModule } from '../offer/offer.module';
import { NotificationORModule } from '../notification-or/notification-or.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OfferRequest]),
    UserSkillModule,
    OfferModule,
    NotificationORModule,
  ],
  providers: [OfferRequestService],
  controllers: [OfferRequestController],
  exports: [OfferRequestService],
})
export class OfferRequestModule {}
