import { Controller } from '@nestjs/common';
import { ReviewService } from '../services/review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
}
