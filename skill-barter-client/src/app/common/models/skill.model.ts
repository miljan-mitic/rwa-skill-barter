import { Category } from './category.model';
import { UserSkill } from './user-skill.model';

export interface Skill {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  category?: Category;
  userSkills?: UserSkill[];
  // barters?: Barter[];
}
