import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Barter } from './barter.entity';
import { User } from './user.entity';

@Entity()
@Check(`"rating" IN (1, 2, 3, 4, 5)`)
@Unique(['barter', 'reviewer'])
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

  @ManyToOne(() => Barter, (barter) => barter.reviews, {
    onDelete: 'CASCADE',
  })
  barter?: Barter;

  @ManyToOne(() => User, (user) => user.writtenReviews, {
    onDelete: 'CASCADE',
  })
  reviewer?: User;
}
