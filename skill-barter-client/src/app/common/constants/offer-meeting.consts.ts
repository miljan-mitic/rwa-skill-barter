import { MeetingStateStatus } from '../enums/meeting-state-status.enum';
import { OfferMeetingType } from '../enums/offer-meeting-type.enum';

export const OFFER_MEETING = {
  AT: {
    BUFFER_MS: 15 * 60 * 1000,
  },
  DURATION: {
    INITIAL: 60,
    MIN: 45,
    MAX: 180,
    STEP: 15,
  },
  FIVE_MINUTES: 5 * 60 * 1000,
  MINUTE: 60 * 1000,
  FIFTEEN_SECONDS: 15 * 1000,
};

export const OFFER_MEETING_TYPE_ICON = {
  [OfferMeetingType.IN_PERSON]: 'location_on',
  [OfferMeetingType.ONLINE]: 'videocam',
};

export const MEETING_STATE_CLASSES = {
  [MeetingStateStatus.UPCOMING]: 'upcoming-meeting-status',
  [MeetingStateStatus.IN_PROGRESS]: 'in-progress-meeting-status',
  [MeetingStateStatus.EXPIRED]: 'expired-meeting-status',
};
