import { EntityState } from '@ngrx/entity';
import { User } from '../../../common/models/user.model';
import { UserFilterDto } from '../dtos/user-filter.dto';

export interface UserState extends EntityState<User> {
  length: number;
  loading: boolean;
  filter: UserFilter;
  currentUser?: User;
}

export interface UserFilter extends UserFilterDto {}
