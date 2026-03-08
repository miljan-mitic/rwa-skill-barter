import { RouterReducerState } from '@ngrx/router-store';
import { AuthState } from '../features/auth/store/auth.state';
import { OfferState } from '../features/offer/store/offer.state';
import { UserSkillState } from '../features/user-skill/store/user-skill.state';
import { UserState } from '../features/user/state/user.state';
import { ConfirmDialogState } from '../shared/confirm-dialog/store/confirm-dialog.state';
import { OfferRequestState } from '../features/offer-request/store/offer-request.state';
import { NotificationORState } from '../features/notification-or/store/notification-or.state';
import { SocketState } from '../shared/socket/store/socket.state';
import { BarterState } from '../features/barter/store/barter.state';
import { CategoryState } from '../features/category/store/category.state';
import { SkillState } from '../features/skill/store/skill.state';

export interface AppState {
  auth: AuthState;
  user: UserState;
  category: CategoryState;
  skill: SkillState;
  userSkill: UserSkillState;
  offer: OfferState;
  offerRequest: OfferRequestState;
  notificationOR: NotificationORState;
  barter: BarterState;
  router: RouterReducerState;
  confirmDialog: ConfirmDialogState;
  socket: SocketState;
}
