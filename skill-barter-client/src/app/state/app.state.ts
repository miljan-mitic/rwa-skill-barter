import { AuthState } from '../features/auth/state/auth.state';
import { UserState } from '../features/user/state/user.state';

export interface AppState {
  auth: AuthState;
  user: UserState;
}
