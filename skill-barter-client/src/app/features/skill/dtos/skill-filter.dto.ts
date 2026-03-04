import { PaginationParams } from '../../../common/interfaces/pagination-params.interface';
import { Skill } from '../../../common/models/skill.model';

export interface SkillFilterDto extends PaginationParams<Skill> {
  categoryId?: number;
  userSkills?: boolean;
}
