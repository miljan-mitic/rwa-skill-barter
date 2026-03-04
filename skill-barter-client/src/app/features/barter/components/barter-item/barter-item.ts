import { Component, inject, Input } from '@angular/core';
import { Barter } from '../../../../common/models/barter.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DATE_FORMAT } from '../../../../common/constants/date-format.const';
import { DatePipe, NgClass } from '@angular/common';
import { MeetingStateStatus } from '../../../../common/enums/meeting-state-status.enum';
import { ExpiresAgoPipe } from '../../../../shared/pipes/expires-ago.pipe';
import { OfferMeetingType } from '../../../../common/enums/offer-meeting-type.enum';
import {
  MEETING_STATE_CLASSES,
  OFFER_MEETING_TYPE_ICON,
} from '../../../../common/constants/offer-meeting.consts';
import { BARTER_USER_ROLE_CLASSES } from '../../../../common/constants/barter-user-role.const';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VideoCall } from '../../../../shared/video-call/components/video-call';

@Component({
  selector: 'app-barter-item',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FlexLayoutModule,
    DatePipe,
    NgClass,
    ExpiresAgoPipe,
  ],
  templateUrl: './barter-item.html',
  styleUrl: './barter-item.scss',
})
export class BarterItem {
  @Input({ required: true }) barter: Barter;
  dateFormat = DATE_FORMAT.DEFAULT;
  meetingStateClasses = MEETING_STATE_CLASSES;
  meetingStateStatus = MeetingStateStatus;
  meetingType = OfferMeetingType;
  meetingTypeIcon = OFFER_MEETING_TYPE_ICON;
  userRoleClasses = BARTER_USER_ROLE_CLASSES;

  private dialog = inject(MatDialog);

  onJoinCall() {
    this.dialog.open(VideoCall, {
      minWidth: '800px',
      minHeight: '600px',
      disableClose: true,
      panelClass: 'dialog-class',
      data: {
        barterId: this.barter.id,
      },
    });
  }
}
