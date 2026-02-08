import { Skill } from './skill.model';
import { User } from './user.model';

export interface UserSkill {
  id: number;
  createdAt: Date;
  description?: string;
  user?: User;
  skill?: Skill;
}
