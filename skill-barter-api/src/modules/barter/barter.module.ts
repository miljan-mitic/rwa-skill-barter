import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Barter } from 'src/entities/barter.entity';
import { BarterService } from './services/barter.service';
import { BarterController } from './controllers/barter.controller';
import { OfferRequestModule } from '../offer-request/offer-request.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Barter]),
    forwardRef(() => OfferRequestModule),
  ],
  providers: [BarterService],
  controllers: [BarterController],
  exports: [BarterService],
})
export class BarterModule {}
