import { OfferMeetingType } from '../../../common/enums/offer-meeting-type.enum';

export interface OfferUpdateDto {
  title?: string;
  meetingType?: OfferMeetingType;
  description?: string;
}
