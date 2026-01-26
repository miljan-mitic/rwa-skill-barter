import { AuthStatus } from '../../../common/enums/auth-status.enum';

export interface AuthState {
  accessToken?: string;
  status: AuthStatus;
}
