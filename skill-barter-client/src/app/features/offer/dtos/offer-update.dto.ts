import { OfferMeetingType } from '../../../common/enums/offer-meeting-type.enum';
import { OfferStatus } from '../../../common/enums/offer-status.enum';

export interface OfferUpdateDto {
  title?: string;
  meetingType?: OfferMeetingType;
  description?: string;
  status?: OfferStatus;
}
