import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Skill } from './skill.entity';
import { User } from './user.entity';

@Entity()
export class UserSkill {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.userSkills, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Skill, (skill) => skill.userSkills, {
    onDelete: 'CASCADE',
  })
  skill: Skill;
}
