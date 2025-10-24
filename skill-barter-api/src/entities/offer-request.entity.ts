import { OFFER_REQUEST_STATUS } from 'src/common/enums/offer-request-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Offer } from './offer.entity';
import { User } from './user.entity';

@Entity()
export class OfferRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  message: string;

  @Column({ type: 'timestamp', nullable: false })
  desiredDate: Date;

  @Column({
    type: 'enum',
    enum: OFFER_REQUEST_STATUS,
    nullable: false,
    default: OFFER_REQUEST_STATUS.PENDING,
  })
  status: OFFER_REQUEST_STATUS;

  @CreateDateColumn({
    type: 'timestamptz',
    nullable: false,
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.offerRequests, { onDelete: 'CASCADE' })
  receiver: User;

  @ManyToOne(() => Offer, (offer) => offer.offerRequests, {
    onDelete: 'CASCADE',
  })
  offer: Offer;
}
