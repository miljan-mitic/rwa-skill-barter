import { ROLE } from 'src/common/enums/role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Review } from './review.entity';
import { UserSkill } from './user-skill.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ type: 'enum', enum: ROLE, nullable: false, default: ROLE.USER })
  role: ROLE;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  createdAt: Date;

  @Column({ nullable: true })
  profilePicture?: string;

  // @Column({ nullable: false, default: 0 })
  // credits: number;

  @Column({ type: 'float', nullable: false, default: 0 })
  ratingAvg: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  ratingCount: number;

  @OneToMany(() => UserSkill, (userSkill) => userSkill.user)
  userSkills?: UserSkill[];

  @OneToMany(() => Review, (review) => review.reviewer)
  writtenReviews?: Review[];
}
