import { MeetingStateStatus } from '../enums/meeting-state-status.enum';

export type MeetingState =
  | {
      status: MeetingStateStatus;
      secondsToStart: never;
      secondsToExpired: never;
    }
  | {
      status: MeetingStateStatus;
      secondsToStart?: number;
      secondsToExpired?: never;
    }
  | {
      status: MeetingStateStatus;
      secondsToStart?: never;
      secondsToExpired?: number;
    };
