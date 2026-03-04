import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BarterFilter, BarterState } from './barter.state';
import { Barter } from '../../../common/models/barter.model';
import { MeetingStateStatus } from '../../../common/enums/meeting-state-status.enum';
import { OFFER_MEETING } from '../../../common/constants/offer-meeting.consts';

export const selectBarterFeature = createFeatureSelector<BarterState>('barter');

export const selectBarterList = createSelector(selectBarterFeature, (state: BarterState) =>
  state.ids.reduce((acc: Barter[], id: number | string) => {
    const barter = state.entities[id];
    if (barter) {
      acc.push(barter);
    }
    return acc;
  }, []),
);

export const selectBarterLength = createSelector(
  selectBarterFeature,
  (state: BarterState) => state.length,
);

export const selectBarterFilter = createSelector(
  selectBarterFeature,
  (state: BarterState) => state.filter,
);

export const selectBarterLoading = createSelector(
  selectBarterFeature,
  (state: BarterState) => state.loading,
);

export const selectBarterPaginationParams = createSelector(
  selectBarterFilter,
  (state: BarterFilter) => ({ page: state.page, pageSize: state.pageSize }),
);

export const selectBarterActiveMeetingState = createSelector(
  selectBarterList,
  (barters: Barter[]) =>
    barters.filter((barter) => barter.meetingState.status !== MeetingStateStatus.EXPIRED),
);

export const selectBarterMeetingsStatesPollingConfig = createSelector(
  selectBarterActiveMeetingState,
  (barters) => {
    if (!barters.length) return null;

    const now = Date.now();
    const closestTime = Math.min(
      ...barters.map((barter) => {
        const meetingStateTime =
          barter.meetingState.status === MeetingStateStatus.UPCOMING
            ? barter.startTime
            : barter.endTime;

        const meetingStateTimeMs = new Date(meetingStateTime).getTime();
        const diff = meetingStateTimeMs - now;

        return diff;
      }),
    );

    const barterIds = barters.map((barter) => barter.id);

    return {
      intervalMs:
        closestTime > OFFER_MEETING.FIVE_MINUTES
          ? OFFER_MEETING.MINUTE
          : OFFER_MEETING.FIFTEEN_SECONDS,
      barterIds,
    };
  },
);
