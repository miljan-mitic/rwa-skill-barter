import { PaginationParams } from '../../../common/interfaces/pagination-params.interface';

export interface UserSkillFilterDto extends PaginationParams {
  userId?: number;
  skillId?: number;
}
