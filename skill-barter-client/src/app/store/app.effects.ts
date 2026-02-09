import { AuthEffects } from '../features/auth/store/auth.effects';
import { OfferEffects } from '../features/offer/store/offer.effects';
import { UserSkillEffects } from '../features/user-skill/store/user-skill.effects';
import { ConfirmDialogEffects } from '../shared/confirm-dialog/store/confirm-dialog.effects';

export const appEffects = [AuthEffects, OfferEffects, UserSkillEffects, ConfirmDialogEffects];
