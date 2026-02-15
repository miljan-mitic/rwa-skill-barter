import { EntityState } from '@ngrx/entity';
import { UserSkill } from '../../../common/models/user-skill.model';
import { Category } from '../../../common/models/category.model';
import { UserSkillFilterDto } from '../dtos/user-skill-filter.dto';

export interface UserSkillState extends EntityState<UserSkill> {
  length: number;
  loading: boolean;
  filter: UserSkillFilter;
  detailedUserSkill?: UserSkill;
}

export interface UserSkillFilter extends UserSkillFilterDto {
  selectedCategory?: Category;
}
