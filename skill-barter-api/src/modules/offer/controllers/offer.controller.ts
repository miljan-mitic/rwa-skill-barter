import { Controller } from '@nestjs/common';
import { OfferService } from '../services/offer.service';

@Controller('offers')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}
}
