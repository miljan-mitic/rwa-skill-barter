import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NotificationOR } from '../../../common/models/notification-or.model';
import { NotificationORFilter, NotificationORState } from './notification-or.state';

export const selectNotificationORFeature =
  createFeatureSelector<NotificationORState>('notificationOR');

export const selectNotificationORList = createSelector(
  selectNotificationORFeature,
  (state: NotificationORState) =>
    state.ids.reduce((acc: NotificationOR[], id: number | string) => {
      const offer = state.entities[id];
      if (offer) {
        acc.push(offer);
      }
      return acc;
    }, []),
);

export const selectNotificationORLength = createSelector(
  selectNotificationORFeature,
  (state: NotificationORState) => state.length,
);

export const selectNotificationORFilter = createSelector(
  selectNotificationORFeature,
  (state: NotificationORState) => state.filter,
);

export const selectNotificationORLoading = createSelector(
  selectNotificationORFeature,
  (state: NotificationORState) => state.loading,
);

export const selectNotificationORPaginationParamas = createSelector(
  selectNotificationORFilter,
  (state: NotificationORFilter) => ({ page: state.page, pageSize: state.pageSize }),
);

export const selectNotificationORNumberUnseen = createSelector(
  selectNotificationORFeature,
  (state: NotificationORState) => state.numberUnseen,
);
