import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferRequest } from 'src/entities/offer-request.entity';
import { OfferRequestService } from './services/offer-request.service';
import { OfferRequestController } from './controllers/offer-request.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OfferRequest])],
  providers: [OfferRequestService],
  controllers: [OfferRequestController],
})
export class OfferRequestModule {}
