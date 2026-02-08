import { PaginationParams } from '../../../common/interfaces/pagination-params.interface';

export interface SkillFilterDto extends PaginationParams {
  categoryId?: number;
  userSkills?: boolean;
}
