import { EntityState } from '@ngrx/entity';
import { Skill } from '../../../common/models/skill.model';
import { SkillFilter } from '../interfaces/skill-filter.interface';

export interface SkillState extends EntityState<Skill> {
  filter?: SkillFilter;
  length: number;
}
