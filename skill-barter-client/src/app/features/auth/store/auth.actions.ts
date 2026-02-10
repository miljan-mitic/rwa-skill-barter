import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../../common/models/user.model';
import { SignupAuthDto } from '../dtos/signup-auth.dto';
import { LoginAuthDto } from '../dtos/login-auth.dto';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Signup: props<{ signupAuthDto: SignupAuthDto }>(),
    'Signup success': props<{ accessToken: string; user: User }>(),
    'Signup failure': props<{ error: any }>(),

    Login: props<{ loginAuthDto: LoginAuthDto }>(),
    'Login success': props<{ accessToken: string; user: User }>(),
    'Login failure': props<{ error: any }>(),

    'Auto Login': props<{ accessToken: string }>(),
    'Auto Login success': props<{ accessToken: string; user: User }>(),
    'Auto Login failure': props<{ error: any }>(),

    Logout: emptyProps(),

    'Unauthorized access': emptyProps(),
  },
});
