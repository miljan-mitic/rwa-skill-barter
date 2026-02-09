import { createEntityAdapter } from '@ngrx/entity';
import { UserSkillState } from './user-skill.state';
import { createReducer, on } from '@ngrx/store';
import { UserSkillActions } from './user-skill.actions';
import { UserSkill } from '../../../common/models/user-skill.model';

const adapter = createEntityAdapter<UserSkill>();

export const initialState: UserSkillState = adapter.getInitialState({
  length: 0,
  filter: {},
});

export const userSkillReducer = createReducer(
  initialState,
  on(
    UserSkillActions.changeUserSkillPaginationFilter,
    (state: UserSkillState, { paginationParams }) => {
      return {
        ...state,
        filter: {
          ...state.filter,
          ...paginationParams,
        },
      };
    },
  ),
  on(UserSkillActions.loadUserSkillsSuccess, (state: UserSkillState, { userSkills, length }) => {
    return adapter.setAll(userSkills, {
      ...state,
      length,
    });
  }),
  on(
    UserSkillActions.loadUserSkillSuccess,
    UserSkillActions.updateUserSkillSuccess,
    (state: UserSkillState, { userSkill }) => {
      return {
        ...state,
        detailedUserSkill: userSkill,
      };
    },
  ),
);
