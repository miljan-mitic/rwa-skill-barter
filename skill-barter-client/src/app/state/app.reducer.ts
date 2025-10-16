import { authReducer } from '../features/auth/state/auth.reducer';
import { userReducer } from '../features/user/state/user.reducer';

export const appReducers = {
  auth: authReducer,
  user: userReducer,
};
