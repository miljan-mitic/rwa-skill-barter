import { MEETING_STATE_STATUS } from '../enums/meeting-state-status.enum';

export type MeetingState =
  | {
      status: MEETING_STATE_STATUS;
      secondsToStart: never;
      secondsToExpired: never;
    }
  | {
      status: MEETING_STATE_STATUS;
      secondsToStart?: number;
      secondsToExpired?: never;
    }
  | {
      status: MEETING_STATE_STATUS;
      secondsToStart?: never;
      secondsToExpired?: number;
    };
