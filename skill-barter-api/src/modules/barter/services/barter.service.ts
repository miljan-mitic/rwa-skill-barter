import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Barter } from 'src/entities/barter.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BarterService {
  constructor(
    @InjectRepository(Barter)
    private readonly barterRepository: Repository<Barter>,
  ) {}
}
