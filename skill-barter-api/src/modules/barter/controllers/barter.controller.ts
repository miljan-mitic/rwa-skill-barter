import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { BarterService } from '../services/barter.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { User } from 'src/entities/user.entity';
import { FilterBarterDto } from '../dtos/filter-barter.dto';
import { BarterMeetingsStatesDto } from '../dtos/barter-meetings-states.dto';

@Controller('barters')
export class BarterController {
  constructor(private readonly barterService: BarterService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getBarters(
    @UserDecorator() user: User,
    @Query() filterBarterDto: FilterBarterDto,
  ) {
    return this.barterService.getBarters(user, filterBarterDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('meetings-states')
  getBartersMeetingsStates(@Query() { ids }: BarterMeetingsStatesDto) {
    return this.barterService.getBartersMeetingsStates(ids);
  }
}
