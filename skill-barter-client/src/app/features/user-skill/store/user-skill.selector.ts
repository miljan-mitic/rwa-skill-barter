import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserSkillState } from './user-skill.state';
import { UserSkill } from '../../../common/models/user-skill.model';

export const selectUserSkillFeature = createFeatureSelector<UserSkillState>('userSkill');

export const selectUserSkillList = createSelector(selectUserSkillFeature, (state: UserSkillState) =>
  state.ids.reduce((acc: UserSkill[], id: string | number) => {
    const userSkill = state.entities[id];
    if (userSkill) {
      acc.push(userSkill);
    }
    return acc;
  }, []),
);

export const selectUserSkillLength = createSelector(
  selectUserSkillFeature,
  (state: UserSkillState) => state.length,
);

export const selectUserSkillFilter = createSelector(
  selectUserSkillFeature,
  (state: UserSkillState) => state.filter,
);

export const selectDetailedUserSkill = createSelector(
  selectUserSkillFeature,
  (state: UserSkillState) => state.detailedUserSkill,
);
