import { Category } from './category.model';
import { Offer } from './offer.model';

export interface Skill {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  category?: Category;
  offers?: Offer[];
  // transactions?: Transaction[];
}
