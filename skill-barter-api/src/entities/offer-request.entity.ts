import { OFFER_REQUEST_STATUS } from 'src/common/enums/offer-request-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Offer } from './offer.entity';
import { UserSkill } from './user-skill.entity';

@Entity()
export class OfferRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, length: 100 })
  message?: string;

  @Column({
    type: 'enum',
    enum: OFFER_REQUEST_STATUS,
    nullable: false,
    default: OFFER_REQUEST_STATUS.PENDING,
  })
  status: OFFER_REQUEST_STATUS;

  @Column({
    type: 'int',
    nullable: false,
    generatedType: 'STORED',
    asExpression: `
        CASE status
          WHEN '${OFFER_REQUEST_STATUS.ACCEPTED}' THEN 1
          WHEN '${OFFER_REQUEST_STATUS.PENDING}' THEN 2
          WHEN '${OFFER_REQUEST_STATUS.REJECTED}' THEN 3
          ELSE 4
        END
      `,
  })
  statusOrder: number;

  @CreateDateColumn({
    type: 'timestamptz',
    nullable: false,
  })
  createdAt: Date;

  @ManyToOne(() => UserSkill, (userSkill) => userSkill.offerRequests, {
    onDelete: 'CASCADE',
  })
  userSkill?: UserSkill;

  @ManyToOne(() => Offer, (offer) => offer.offerRequests, {
    onDelete: 'CASCADE',
  })
  offer?: Offer;
}
