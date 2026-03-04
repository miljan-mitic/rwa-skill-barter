import { PaginationParams } from '../../../common/interfaces/pagination-params.interface';
import { UserSkill } from '../../../common/models/user-skill.model';

export interface UserSkillFilterDto extends PaginationParams<UserSkill> {
  userId?: number;
  skillId?: number;
}
