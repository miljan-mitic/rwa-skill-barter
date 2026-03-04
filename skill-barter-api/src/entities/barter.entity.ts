import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Review } from './review.entity';
import { OfferRequest } from './offer-request.entity';

@Entity()
export class Barter {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column({ nullable: false, default: 0 })
  // credits: number;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  startTime: Date;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  endTime: Date;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @OneToOne(() => OfferRequest, (offerRequest) => offerRequest.barter)
  @JoinColumn()
  offerRequest?: OfferRequest;

  @OneToMany(() => Review, (review) => review.barter)
  reviews?: Review[];
}
