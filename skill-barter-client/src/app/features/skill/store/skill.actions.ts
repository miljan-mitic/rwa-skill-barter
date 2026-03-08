import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { SkillDto } from '../dtos/skill.dto';
import { Skill } from '../../../common/models/skill.model';
import { SkillFilterDto } from '../dtos/skill-filter.dto';
import { SkillFilter } from './skill.state';

export const SkillActions = createActionGroup({
  source: 'Skill',
  events: {
    'Create skill': props<{ skillDto: SkillDto }>(),
    'Create skill success': props<{ skill: Skill }>(),
    'Create skill failure': props<{ error: any }>(),

    'Load skills': props<{ skillFilterDto: SkillFilterDto }>(),
    'Load skills success': props<{ skills: Skill[]; length: number }>(),
    'Load skills failure': props<{ error: any }>(),

    'Restart skill filter': emptyProps(),
    'Change skill filter': props<{
      filter: SkillFilter;
    }>(),

    'Delete skill': props<{ id: number }>(),
    'Delete skill success': emptyProps(),
    'Delete skill failure': props<{ error: any }>(),
  },
});
