import { Skill } from './skill.model';

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  skills?: Skill[];
}
