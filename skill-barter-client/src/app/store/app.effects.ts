import { AuthEffects } from '../features/auth/store/auth.effects';
import { BarterEffects } from '../features/barter/store/barter.effects';
import { NotificationOREffects } from '../features/notification-or/store/notification-or.effects';
import { OfferRequestEffects } from '../features/offer-request/store/offer-request.effects';
import { OfferEffects } from '../features/offer/store/offer.effects';
import { ReviewEffects } from '../features/review/store/review.effects';
import { UserSkillEffects } from '../features/user-skill/store/user-skill.effects';
import { UserEffects } from '../features/user/state/user.effects';
import { ConfirmDialogEffects } from '../shared/confirm-dialog/store/confirm-dialog.effects';

export const appEffects = [
  AuthEffects,
  UserEffects,
  UserSkillEffects,
  OfferEffects,
  OfferRequestEffects,
  BarterEffects,
  ReviewEffects,
  NotificationOREffects,
  ConfirmDialogEffects,
];
