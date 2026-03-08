import { createEntityAdapter } from '@ngrx/entity';
import { PAGINATION_PARAMS } from '../../../common/constants/pagination-params.const';
import { SortType } from '../../../common/enums/sort.enum';
import { createReducer, on } from '@ngrx/store';
import { Skill } from '../../../common/models/skill.model';
import { SkillFilter, SkillState } from './skill.state';
import { SkillActions } from './skill.actions';

const adapter = createEntityAdapter<Skill>();

const initialStateFilter: SkillFilter = {
  page: PAGINATION_PARAMS.DEFAULT.PAGE,
  pageSize: PAGINATION_PARAMS.DEFAULT.PAGE_SIZE,
  sortBy: 'createdAt',
  sortType: SortType.DESC,
};

export const initialState: SkillState = adapter.getInitialState({
  length: 0,
  loading: false,
  filter: initialStateFilter,
});

export const skillReducer = createReducer(
  initialState,
  on(SkillActions.loadSkills, (state: SkillState) => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(SkillActions.restartSkillFilter, (state: SkillState) => {
    return { ...state, filter: initialStateFilter };
  }),
  on(SkillActions.changeSkillFilter, (state: SkillState, { filter }) => {
    return {
      ...state,
      filter: {
        ...state.filter,
        ...filter,
      },
    };
  }),
  on(SkillActions.loadSkillsSuccess, (state: SkillState, { skills, length }) => {
    return adapter.setAll(skills, {
      ...state,
      length,
      loading: false,
    });
  }),
  on(SkillActions.loadSkillsFailure, (state: SkillState) => {
    return {
      ...state,
      loading: false,
    };
  }),
);
