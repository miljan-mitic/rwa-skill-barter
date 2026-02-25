import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OfferRequestService } from '../services/offer-request.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { User } from 'src/entities/user.entity';
import { CreateOfferRequestDto } from '../dtos/create-offer-request.dto';
import { FilterOfferRequestDto } from '../dtos/filter-offer-request.dto';
import { UpdateOfferRequestDto } from '../dtos/update-offer-request.dto';

@Controller('offer-requests')
export class OfferRequestController {
  constructor(private readonly offerRequestService: OfferRequestService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @UserDecorator() user: User,
    @Body() createOfferRequestDto: CreateOfferRequestDto,
  ) {
    return this.offerRequestService.create(user, createOfferRequestDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getOfferRequests(
    @UserDecorator() user: User,
    @Query() filterOfferRequestDto: FilterOfferRequestDto,
  ) {
    return this.offerRequestService.getOfferRequests(
      user,
      filterOfferRequestDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateOffer(
    @UserDecorator() user: User,
    @Param('id') id: number,
    @Body() updateOfferDto: UpdateOfferRequestDto,
  ) {
    return this.offerRequestService.updateOfferRequest(
      user,
      id,
      updateOfferDto,
    );
  }
}
