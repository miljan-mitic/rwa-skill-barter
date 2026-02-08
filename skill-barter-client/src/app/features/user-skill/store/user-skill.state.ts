import { EntityState } from '@ngrx/entity';
import { UserSkill } from '../../../common/models/user-skill.model';
import { Category } from '../../../common/models/category.model';
import { User } from '../../../common/models/user.model';
import { UserSkillFilterDto } from '../dtos/user-skill-filter.dto';

export interface UserSkillState extends EntityState<UserSkill> {
  filter?: UserSkillFilter;
  length: number;
  detailedUserSkill?: UserSkill;
}

interface UserSkillFilter extends UserSkillFilterDto {
  selectedCategory?: Category;
  selectedUser?: User;
}
