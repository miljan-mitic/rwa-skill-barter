import { AuthState } from '../features/auth/store/auth.state';
import { OfferState } from '../features/offer/store/offer.state';
import { SkillState } from '../features/skill/store/skill.state';
import { UserState } from '../features/user/state/user.state';

export interface AppState {
  auth: AuthState;
  user: UserState;
  offer: OfferState;
  skill: SkillState;
}
