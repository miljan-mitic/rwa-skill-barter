import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../../common/models/user.model';
import { UserUpdateDto } from '../dtos/user-update.dto';
import { UserFilterDto } from '../dtos/user-filter.dto';
import { UserFilter } from './user.state';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    'Load users': props<{ userFilterDto: UserFilterDto }>(),
    'Load users success': props<{ users: User[]; length: number }>(),
    'Load users failure': props<{ error: any }>(),

    'Restart user filter': emptyProps(),
    'Change user filter': props<{
      filter: UserFilter;
    }>(),

    'Update profile': props<{ userUpdateDto: UserUpdateDto }>(),
    'Update profile success': props<{ user: User }>(),
    'Update profile failure': props<{ error: any }>(),
  },
});
