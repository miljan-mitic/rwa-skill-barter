import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Offer } from './offer.entity';
import { Transaction } from './transaction.entity';
import { Category } from './category.entity';

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ length: 100 })
  description: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @ManyToOne(() => Category, (category) => category.skills, {
    onDelete: 'CASCADE',
  })
  category: Category;

  @OneToMany(() => Offer, (offer) => offer.skill)
  offers: Offer[];

  @OneToMany(() => Transaction, (transaction) => transaction.skill)
  transactions: Transaction[];
}
