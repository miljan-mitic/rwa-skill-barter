import { OfferMeetingType } from '../../../common/enums/offer-meeting-type.enum';

export interface OfferDto {
  title: string;
  userSkillId: number;
  meetingType?: OfferMeetingType;
  description?: string;
}
