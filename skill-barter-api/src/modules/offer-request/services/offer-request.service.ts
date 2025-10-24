import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OfferRequest } from 'src/entities/offer-request.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OfferRequestService {
  constructor(
    @InjectRepository(OfferRequest)
    private readonly offerRequestRepository: Repository<OfferRequest>,
  ) {}
}
