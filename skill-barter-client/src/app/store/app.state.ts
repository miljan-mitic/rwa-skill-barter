import { RouterReducerState } from '@ngrx/router-store';
import { AuthState } from '../features/auth/store/auth.state';
import { OfferState } from '../features/offer/store/offer.state';
import { UserSkillState } from '../features/user-skill/store/user-skill.state';
import { UserState } from '../features/user/state/user.state';

export interface AppState {
  auth: AuthState;
  user: UserState;
  offer: OfferState;
  userSkill: UserSkillState;
  router: RouterReducerState;
}
