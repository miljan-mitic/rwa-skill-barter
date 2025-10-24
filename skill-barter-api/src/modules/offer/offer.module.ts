import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from 'src/entities/offer.entity';
import { OfferService } from './services/offer.service';
import { OfferController } from './controllers/offer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Offer])],
  providers: [OfferService],
  controllers: [OfferController],
})
export class OfferModule {}
