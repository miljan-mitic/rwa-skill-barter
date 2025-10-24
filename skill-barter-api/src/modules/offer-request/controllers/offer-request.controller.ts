import { Controller } from '@nestjs/common';
import { OfferRequestService } from '../services/offer-request.service';

@Controller('offer-requests')
export class OfferRequestController {
  constructor(private readonly offerRequestService: OfferRequestService) {}
}
