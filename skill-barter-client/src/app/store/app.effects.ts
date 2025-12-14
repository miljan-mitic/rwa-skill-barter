import { AuthEffects } from '../features/auth/store/auth.effects';
import { OfferEffects } from '../features/offer/store/offer.effects';
import { SkillEffects } from '../features/skill/store/skill.effects';

export const appEffects = [AuthEffects, OfferEffects, SkillEffects];
