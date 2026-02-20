import { OFFER_STATUS } from 'src/common/enums/offer-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OfferRequest } from './offer-request.entity';
import { Barter } from './barter.entity';
import { OFFER_MEETING_TYPE } from 'src/common/enums/offer-meeting-type.enum';
import { UserSkill } from './user-skill.entity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 30 })
  title: string;

  @Column({ nullable: true, length: 100 })
  description?: string;

  // @Column({ type: 'int', nullable: false, default: 0 })
  // barterCredits: number;

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

  @Column({
    type: 'timestamp',
    nullable: false,
    // default: () => 'CURRENT_TIMESTAMP',
  })
  meetingAt: Date;

  @Column({ type: 'int', nullable: false })
  durationMinutes: number;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  createdAt: Date;

  @ManyToOne(() => UserSkill, (userSkill) => userSkill.offers, {
    onDelete: 'CASCADE',
  })
  userSkill?: UserSkill;

  @OneToMany(() => OfferRequest, (offerRequest) => offerRequest.offer)
  offerRequests?: OfferRequest[];

  @OneToOne(() => Barter, (barter) => barter.offer)
  barter?: Barter;
}
