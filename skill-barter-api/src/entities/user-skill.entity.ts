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
import { Offer } from './offer.entity';

@Entity()
export class UserSkill {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @Column({ nullable: true, length: 100 })
  description: string;

  @ManyToOne(() => User, (user) => user.userSkills, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Skill, (skill) => skill.userSkills, {
    onDelete: 'CASCADE',
  })
  skill: Skill;

  @OneToMany(() => Offer, (offer) => offer.userSkill)
  offers: Offer[];
}
