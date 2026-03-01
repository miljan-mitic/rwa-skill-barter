import { routerReducer } from '@ngrx/router-store';
import { authReducer } from '../features/auth/store/auth.reducer';
import { offerReducer } from '../features/offer/store/offer.reducer';
import { userSkillReducer } from '../features/user-skill/store/user-skill.reducer';
import { userReducer } from '../features/user/state/user.reducer';
import { confirmDialogReducer } from '../shared/confirm-dialog/store/confirm-dialog.reducer';
import { offerRequestReducer } from '../features/offer-request/store/offer-request.reducer';
import { notificationORReducer } from '../features/notification-or/store/notification-or.reducer';
import { socketReducer } from '../shared/socket/store/socket.reducer';

export const appReducers = {
  auth: authReducer,
  user: userReducer,
  userSkill: userSkillReducer,
  offer: offerReducer,
  offerRequest: offerRequestReducer,
  notificationOR: notificationORReducer,
  router: routerReducer,
  confirmDialog: confirmDialogReducer,
  socket: socketReducer,
};
