import { ROLE } from 'src/common/enums/role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Offer } from './offer.entity';
import { OfferRequest } from './offer-request.entity';
import { Transaction } from './transaction.entity';
import { Review } from './review.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ type: 'enum', enum: ROLE, nullable: false, default: ROLE.USER })
  role: ROLE;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  createdAt: Date;

  @Column({ nullable: true })
  profilePicture?: string;

  @Column({ nullable: false, default: 0 })
  credits: number;

  @Column({ nullable: false, default: 0 })
  ratingAvg: number;

  @OneToMany(() => Offer, (offer) => offer.provider)
  offers: Offer[];

  @OneToMany(() => OfferRequest, (offerRequest) => offerRequest.receiver)
  offerRequests: OfferRequest[];

  @OneToMany(() => Transaction, (transaction) => transaction.provider)
  providedTransactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.receiver)
  receivedTransactions: Transaction[];

  @OneToMany(() => Review, (review) => review.reviewer)
  writtenReviews: Review[];

  @OneToMany(() => Review, (review) => review.reviewee)
  receivedReviews: Review[];
}
