import { createActionGroup, props } from '@ngrx/store';
import { PaginationParams } from '../../../common/interfaces/pagination-params.interface';
import { SkillFilterDto } from '../dtos/skill-filter.dto';
import { Skill } from '../../../common/models/skill.model';

export const SkillActions = createActionGroup({
  source: 'Skill',
  events: {
    'Load skills': props<{ skillFilterDto: SkillFilterDto; isAdmin?: boolean }>(),
    'Load skills success': props<{ skills: Skill[]; length: number }>(),
    'Load skills failure': props<{ error: any }>(),
    'Change skill pagination filter': props<{ paginationParams: PaginationParams }>(),
  },
});
