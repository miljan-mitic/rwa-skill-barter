import { routerReducer } from '@ngrx/router-store';
import { authReducer } from '../features/auth/store/auth.reducer';
import { offerReducer } from '../features/offer/store/offer.reducer';
import { userSkillReducer } from '../features/user-skill/store/user-skill.reducer';
import { userReducer } from '../features/user/state/user.reducer';

export const appReducers = {
  auth: authReducer,
  user: userReducer,
  offer: offerReducer,
  userSkill: userSkillReducer,
  router: routerReducer,
};
