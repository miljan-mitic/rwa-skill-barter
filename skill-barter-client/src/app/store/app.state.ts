import { RouterReducerState } from '@ngrx/router-store';
import { AuthState } from '../features/auth/store/auth.state';
import { OfferState } from '../features/offer/store/offer.state';
import { UserSkillState } from '../features/user-skill/store/user-skill.state';
import { UserState } from '../features/user/state/user.state';
import { ConfirmDialogState } from '../shared/confirm-dialog/store/confirm-dialog.state';
import { OfferRequestState } from '../features/offer-request/store/offer-request.state';

export interface AppState {
  auth: AuthState;
  user: UserState;
  userSkill: UserSkillState;
  offer: OfferState;
  offerRequest: OfferRequestState;
  router: RouterReducerState;
  confirmDialog: ConfirmDialogState;
}
