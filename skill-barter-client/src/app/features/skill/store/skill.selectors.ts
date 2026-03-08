import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SkillFilter, SkillState } from './skill.state';
import { Skill } from '../../../common/models/skill.model';

export const selectSkillFeature = createFeatureSelector<SkillState>('skill');

export const selectSkillList = createSelector(selectSkillFeature, (state: SkillState) =>
  state.ids.reduce((acc: Skill[], id: string | number) => {
    const skill = state.entities[id];
    if (skill) {
      acc.push(skill);
    }
    return acc;
  }, []),
);

export const selectSkillLength = createSelector(
  selectSkillFeature,
  (state: SkillState) => state.length,
);

export const selectSkillLoading = createSelector(
  selectSkillFeature,
  (state: SkillState) => state.loading,
);

export const selectSkillFilter = createSelector(
  selectSkillFeature,
  (state: SkillState) => state.filter,
);

export const selectSkillPaginationParams = createSelector(
  selectSkillFilter,
  (state: SkillFilter) => ({ page: state.page, pageSize: state.pageSize }),
);
