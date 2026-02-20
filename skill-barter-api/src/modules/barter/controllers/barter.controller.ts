import { Controller } from '@nestjs/common';
import { BarterService } from '../services/barter.service';

@Controller('barter')
export class BarterController {
  constructor(private readonly barterService: BarterService) {}
}
