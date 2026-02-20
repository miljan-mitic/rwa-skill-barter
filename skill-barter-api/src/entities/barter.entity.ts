import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Offer } from './offer.entity';
import { Review } from './review.entity';

@Entity()
export class Barter {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column({ nullable: false, default: 0 })
  // credits: number;

  @Column({
    type: 'timestamp',
    nullable: false,
    // default: () => 'CURRENT_TIMESTAMP',
  })
  completedAt: Date;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @OneToOne(() => Offer, (offer) => offer.barter)
  @JoinColumn()
  offer?: Offer;

  @OneToMany(() => Review, (review) => review.barter)
  reviews?: Review[];
}
