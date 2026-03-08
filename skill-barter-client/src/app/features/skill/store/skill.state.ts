import { EntityState } from '@ngrx/entity';
import { SkillFilterDto } from '../dtos/skill-filter.dto';
import { Skill } from '../../../common/models/skill.model';

export interface SkillState extends EntityState<Skill> {
  length: number;
  loading: boolean;
  filter: SkillFilter;
}

export interface SkillFilter extends SkillFilterDto {}
