import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { User } from './user.entity';

@Entity()
@Check(`"rating" IN (1, 2, 3, 4, 5)`)
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: 5 })
  rating: number;

  @Column({ length: 100 })
  comment: string;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  createdAt: Date;

  @ManyToOne(() => Transaction, (transaction) => transaction.reviews, {
    onDelete: 'CASCADE',
  })
  transaction: Transaction;

  @ManyToOne(() => User, (user) => user.writtenReviews, {
    onDelete: 'CASCADE',
  })
  reviewer: User;

  @ManyToOne(() => User, (user) => user.receivedReviews, {
    onDelete: 'CASCADE',
  })
  reviewee: User;
}
