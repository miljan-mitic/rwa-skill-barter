import { Category } from '../../../common/models/category.model';
import { User } from '../../../common/models/user.model';
import { SkillFilterDto } from '../dtos/skill-filter.dto';

export interface SkillFilter extends SkillFilterDto {
  selectedCategory?: Category;
  selectedUser?: User;
}
