import { authReducer } from '../features/auth/store/auth.reducer';
import { offerReducer } from '../features/offer/store/offer.reducer';
import { skillReducer } from '../features/skill/store/skill.reducer';
import { userReducer } from '../features/user/state/user.reducer';

export const appReducers = {
  auth: authReducer,
  user: userReducer,
  offer: offerReducer,
  skill: skillReducer,
};
