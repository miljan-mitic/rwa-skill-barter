import { Barter } from './barter.model';
import { User } from './user.model';

export interface Review {
  id: number;
  rating: number;
  comment?: string;
  createdAt: Date;
  barter?: Barter;
  reviewer?: User;
}
