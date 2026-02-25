import { Role } from '../enums/role.enum';
import { UserSkill } from './user-skill.model';

export interface User {
  id: number;
  email: string;
  username: string;
  role: Role;
  createdAt: Date;
  profilePicture?: string;
  ratingAvg: number;
  ratingCount: number;
  userSkills?: UserSkill[];
}
