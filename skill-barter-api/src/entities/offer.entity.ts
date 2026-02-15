import { OFFER_STATUS } from 'src/common/enums/offer-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { OfferRequest } from './offer-request.entity';
import { Transaction } from './transaction.entity';
import { OFFER_MEETING_TYPE } from 'src/common/enums/offer-meeting-type.enum';
import { UserSkill } from './user-skill.entity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 30 })
  title: string;

  @Column({ nullable: true, length: 100 })
  description: string;

  @Column({ nullable: false, default: 0 })
  barterCredits: number;

  @Column({
    type: 'enum',
    enum: OFFER_MEETING_TYPE,
    nullable: false,
    default: OFFER_MEETING_TYPE.ONLINE,
  })
  meetingType: OFFER_MEETING_TYPE;

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

  @ManyToOne(() => UserSkill, (userSkill) => userSkill.offers, {
    onDelete: 'CASCADE',
  })
  userSkill: UserSkill;

  @OneToMany(() => OfferRequest, (offerRequest) => offerRequest.offer)
  offerRequests: OfferRequest[];

  @OneToMany(() => Transaction, (transaction) => transaction.offer)
  transactions: Transaction[];
}
