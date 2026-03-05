import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReviewService } from '../services/review.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { User } from 'src/entities/user.entity';
import { CreateReviewDto } from '../dtos/create-review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @UserDecorator() user: User,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewService.create(user, createReviewDto);
  }
}
