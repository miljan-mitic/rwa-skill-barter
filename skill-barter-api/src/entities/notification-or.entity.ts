import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OfferRequest } from './offer-request.entity';
import { NOTIFICATION_OR_TYPE } from 'src/common/enums/notification-or-type.enum';

@Entity()
export class NotificationOR {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: NOTIFICATION_OR_TYPE,
    nullable: false,
  })
  type: NOTIFICATION_OR_TYPE;

  // @Column({ nullable: false })
  // message: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  seen: boolean;

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  createdAt: Date;

  @ManyToOne(
    () => OfferRequest,
    (offerRequest) => offerRequest.notificationsOR,
    {
      onDelete: 'CASCADE',
    },
  )
  offerRequest?: OfferRequest;
}
