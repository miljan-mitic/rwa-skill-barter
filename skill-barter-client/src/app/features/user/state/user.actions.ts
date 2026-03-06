import { createActionGroup, props } from '@ngrx/store';
import { User } from '../../../common/models/user.model';
import { UpdateUserDto } from '../dtos/update-user.dto';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    'Update profile': props<{ updateUserDto: UpdateUserDto }>(),
    'Update profile success': props<{ user: User }>(),
    'Update profile failure': props<{ error: any }>(),
  },
});
