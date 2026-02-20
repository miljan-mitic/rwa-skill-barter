import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Barter } from 'src/entities/barter.entity';
import { BarterService } from './services/barter.service';
import { BarterController } from './controllers/barter.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Barter])],
  providers: [BarterService],
  controllers: [BarterController],
})
export class BarterModule {}
