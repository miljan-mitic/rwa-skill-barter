import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { PaginationParams } from '../../../common/interfaces/pagination-params.interface';
import { UserSkillFilterDto } from '../dtos/user-skill-filter.dto';
import { UserSkill } from '../../../common/models/user-skill.model';
import { UserSkillDto } from '../dtos/user-skill.dto';
import { UserSkillUpdateDto } from '../dtos/user-skill-update.dto';

export const UserSkillActions = createActionGroup({
  source: 'UserSkill',
  events: {
    'Create user skill': props<{ userSkillDto: UserSkillDto }>(),
    'Create user skill success': props<{ userSkill: UserSkill }>(),
    'Create user skill failure': props<{ error: any }>(),

    'Load user skills': props<{ userSkillFilterDto: UserSkillFilterDto; isAdmin?: boolean }>(),
    'Load user skills success': props<{ userSkills: UserSkill[]; length: number }>(),
    'Load user skills failure': props<{ error: any }>(),

    'Restart user skill filter': emptyProps(),
    'Change user skill pagination filter': props<{ paginationParams: PaginationParams }>(),

    'Load user skill': props<{ id: number; isAdmin?: boolean }>(),
    'Load user skill success': props<{ userSkill: UserSkill }>(),
    'Load user skill failure': props<{ error: any }>(),

    'Update user skill': props<{ id: number; userSkillUpdateDto: UserSkillUpdateDto }>(),
    'Update user skill success': props<{ userSkill: UserSkill }>(),
    'Update user skill failure': props<{ error: any }>(),

    'Delete user skill': props<{ id: number }>(),
    'Delete user skill success': emptyProps(),
    'Delete user skill failure': props<{ error: any }>(),
  },
});
