import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OfferService } from '../services/offer.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { FilterOfferDto } from '../dtos/filter-offer.dto';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { User } from 'src/entities/user.entity';
import { CreateOfferDto } from '../dtos/create-offer.dto';
import { UpdateOfferDto } from '../dtos/update-offer.dto';

@Controller('offers')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@UserDecorator() user: User, @Body() createOfferDto: CreateOfferDto) {
    return this.offerService.create(user, createOfferDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getOffers(
    @UserDecorator() user: User,
    @Query() filterOfferDto: FilterOfferDto,
  ) {
    return this.offerService.getOffers(user, filterOfferDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOfferById(@UserDecorator() user: User, @Param('id') id: number) {
    return this.offerService.getOfferById(user, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateOffer(
    @UserDecorator() user: User,
    @Param('id') id: number,
    @Body() updateOfferDto: UpdateOfferDto,
  ) {
    return this.offerService.updateOffer(user, id, updateOfferDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteOffer(@UserDecorator() user: User, @Param('id') id: number) {
    return this.offerService.deleteOffer(user, id);
  }
}
