import { Barter } from 'src/entities/barter.entity';
import { MeetingState } from '../types/meeting-state.type';

export interface BarterMeetingState extends Barter {
  meetingState?: MeetingState;
}
