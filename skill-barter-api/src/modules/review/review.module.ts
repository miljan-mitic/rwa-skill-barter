import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/entities/review.entity';
import { ReviewService } from './services/review.service';
import { ReviewController } from './controllers/review.controller';
import { BarterModule } from '../barter/barter.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), BarterModule, UserModule],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
