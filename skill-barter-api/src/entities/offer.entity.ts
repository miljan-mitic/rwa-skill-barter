import { OFFER_STATUS } from 'src/common/enums/offer-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Skill } from './skill.entity';
import { User } from './user.entity';
import { OfferRequest } from './offer-request.entity';
import { Transaction } from './transaction.entity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ length: 100 })
  description: string;

  @Column({ nullable: false, default: 0 })
  barterCredits: number;

  @Column({ nullable: false })
  availability: string;

  @Column({
    type: 'enum',
    enum: OFFER_STATUS,
    nullable: false,
    default: OFFER_STATUS.ACTIVE,
  })
  status: OFFER_STATUS;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.offers, { onDelete: 'CASCADE' })
  provider: User;

  @ManyToOne(() => Skill, (skill) => skill.offers, { onDelete: 'CASCADE' })
  skill: Skill;

  @OneToMany(() => OfferRequest, (offerRequest) => offerRequest.offer)
  offerRequests: OfferRequest[];

  @OneToMany(() => Transaction, (transaction) => transaction.offer)
  transactions: Transaction[];
}
