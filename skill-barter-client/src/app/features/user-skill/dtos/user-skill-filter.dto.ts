import { PaginationParams } from '../../../common/interfaces/pagination-params.interface';

export interface UserSkillFilterDto extends PaginationParams {
  skillId?: number;
}
