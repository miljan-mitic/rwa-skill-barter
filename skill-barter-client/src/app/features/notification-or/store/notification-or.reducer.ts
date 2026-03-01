import { createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { PAGINATION_PARAMS } from '../../../common/constants/pagination-params.const';
import { SortBy, SortType } from '../../../common/enums/sort.enum';
import { NotificationOR } from '../../../common/models/notification-or.model';
import { NotificationORFilter, NotificationORState } from './notification-or.state';
import { NotificationORActions } from './notification-or.actions';

const adapter = createEntityAdapter<NotificationOR>();

export const initialStateNotificationORFilter: NotificationORFilter = {
  page: PAGINATION_PARAMS.DEFAULT.PAGE,
  pageSize: PAGINATION_PARAMS.DEFAULT.PAGE_SIZE,
  sortBy: SortBy.CREATED_AT,
  sortType: SortType.DESC,
};

export const initialState: NotificationORState = adapter.getInitialState({
  length: 0,
  loading: false,
  filter: initialStateNotificationORFilter,
});

export const notificationORReducer = createReducer(
  initialState,
  on(NotificationORActions.loadNotificationsOR, (state: NotificationORState) => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(NotificationORActions.changeNotificationORFilter, (state: NotificationORState, { filter }) => {
    return {
      ...state,
      filter: {
        ...state.filter,
        ...filter,
      },
    };
  }),
  on(
    NotificationORActions.loadNotificationsORSuccess,
    (state: NotificationORState, { notificationsOR, length }) => {
      return adapter.setAll(notificationsOR, {
        ...state,
        length,
        loading: false,
      });
    },
  ),
  on(
    NotificationORActions.loadNumberUnseenNotificationsORSuccess,
    (state: NotificationORState, { numberUnseen }) => {
      return {
        ...state,
        numberUnseen,
      };
    },
  ),
  on(
    NotificationORActions.notificationORReceived,
    (state: NotificationORState, { notificationOR }) => {
      const numberUnseen = state.numberUnseen ? state.numberUnseen + 1 : 1;

      if (!state.ids?.length) {
        return {
          ...state,
          numberUnseen,
        };
      }

      if (state.filter.page === 0) {
        const ids = [...state.ids] as number[];

        const isLargerPageSize =
          initialStateNotificationORFilter?.pageSize &&
          ids.length >= initialStateNotificationORFilter.pageSize;

        if (isLargerPageSize) {
          const lasId = ids[ids.length - 1];
          state = adapter.removeOne(lasId, state);
        }

        state = adapter.addOne(notificationOR, state);

        const newIds = [
          notificationOR.id,
          ...state.ids.filter((id) => id !== notificationOR.id),
        ] as typeof state.ids;

        return {
          ...state,
          ids: newIds,
          numberUnseen,
          length: state.length + 1,
        };
      }

      return { ...state, numberUnseen, length: state.length + 1 };
    },
  ),
  on(
    NotificationORActions.seenNotificationsORSuccess,
    (state: NotificationORState, { updatedNotificationsOR }) => {
      return adapter.updateMany(updatedNotificationsOR, {
        ...state,
        numberUnseen: state.numberUnseen ? state.numberUnseen - updatedNotificationsOR.length : 0,
      });
    },
  ),
  on(NotificationORActions.loadNotificationsORFailure, (state: NotificationORState) => {
    return {
      ...state,
      loading: false,
    };
  }),
);
