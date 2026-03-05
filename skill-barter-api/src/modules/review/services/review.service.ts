import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/entities/review.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { BarterService } from 'src/modules/barter/services/barter.service';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly barterService: BarterService,
    private readonly userService: UserService,
  ) {}

  async create(user: User, createReviewDto: CreateReviewDto) {
    const { barterId, ...createReviewData } = createReviewDto;

    const barter = await this.barterService.findById(barterId, {
      offerRequest: {
        userSkill: { user: true },
        offer: { userSkill: { user: true } },
      },
    });

    const userIds = [
      barter.offerRequest.userSkill.user.id,
      barter.offerRequest.offer.userSkill.user.id,
    ];

    if (!userIds.includes(user.id)) {
      throw new ForbiddenException('Access denied!');
    }

    const now = Date.now();
    const endTime = new Date(barter.endTime).getTime();

    if (now < endTime) {
      throw new BadRequestException('Barter is not finished yet.');
    }

    const reviews = await this.reviewRepository.find({
      where: { barter: { id: barterId } },
      relations: { reviewer: true },
    });

    const isExistsReview = reviews.filter(
      (review) => review.reviewer.id === user.id,
    );

    if (reviews.length > 2 || isExistsReview.length) {
      throw new BadRequestException('You have already give rating');
    }

    const newReview = this.reviewRepository.create({
      ...createReviewData,
      reviewer: user,
      barter,
    });

    const userId = userIds.filter((userId) => userId !== user.id)[0];

    const isAddedNewRating = await this.userService.addNewRating(
      userId,
      createReviewData.rating,
    );

    try {
      if (isAddedNewRating) {
        await this.reviewRepository.save(newReview);
      }
    } catch (error) {
      console.warn('REVIEW SERVICE - CREATE REVIEW:', error);
      throw new InternalServerErrorException('Unexpected error');
    }

    return newReview;
  }
}
