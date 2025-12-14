import { createEntityAdapter } from '@ngrx/entity';
import { Skill } from '../../../common/models/skill.model';
import { SkillState } from './skill.state';
import { createReducer, on } from '@ngrx/store';
import { SkillActions } from './skill.actions';

const adapter = createEntityAdapter<Skill>();

export const initialState: SkillState = adapter.getInitialState({
  length: 0,
  filter: {},
});

export const skillReducer = createReducer(
  initialState,
  on(SkillActions.changeSkillPaginationFilter, (state: SkillState, { paginationParams }) => {
    return {
      ...state,
      filter: {
        ...state.filter,
        ...paginationParams,
      },
    };
  }),
  on(SkillActions.loadSkillsSuccess, (state: SkillState, { skills, length }) => {
    return adapter.setAll(skills, {
      ...state,
      length,
    });
  })
);
