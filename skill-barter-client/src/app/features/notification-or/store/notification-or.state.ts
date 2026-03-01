import { EntityState } from '@ngrx/entity';
import { NotificationOR } from '../../../common/models/notification-or.model';
import { NotificationORFilterDto } from '../dtos/notification-or-filter.dto';

export interface NotificationORState extends EntityState<NotificationOR> {
  length: number;
  loading: boolean;
  numberUnseen?: number;
  filter: NotificationORFilter;
}

export interface NotificationORFilter extends NotificationORFilterDto {}

export interface UpdateNotificationOR {
  id: number;
  changes: Partial<NotificationOR>;
}
