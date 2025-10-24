import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Offer } from './offer.entity';
import { User } from './user.entity';
import { Skill } from './skill.entity';
import { Review } from './review.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: 0 })
  credits: number;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  completedAt: Date;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @ManyToOne(() => Offer, (offer) => offer.transactions, {
    onDelete: 'CASCADE',
  })
  offer: Offer;

  @ManyToOne(() => User, (user) => user.providedTransactions, {
    onDelete: 'CASCADE',
  })
  provider: User;

  @ManyToOne(() => User, (user) => user.receivedTransactions, {
    onDelete: 'CASCADE',
  })
  receiver: User;

  @ManyToOne(() => Skill, (skill) => skill.transactions, {
    onDelete: 'CASCADE',
  })
  skill: Skill;

  @OneToMany(() => Review, (review) => review.transaction)
  reviews: Review[];
}
