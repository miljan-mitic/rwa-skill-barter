import { Component, inject, Input } from '@angular/core';
import { NotificationOR } from '../../../../common/models/notification-or.model';
import { DATE_FORMAT } from '../../../../common/constants/date-format.const';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CreatedAgoPipe } from '../../../../shared/pipes/created-ago.pipe';
import {
  NOTIFICATION_OR_TYPE_ICON,
  NOTIFICATION_OR_TYPE_ICON_CLASSES,
} from '../../../../common/constants/notification-or-type.consts';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgClass } from '@angular/common';
import { Store } from '@ngrx/store';
import { NotificationORState } from '../../store/notification-or.state';
import { NotificationORActions } from '../../store/notification-or.actions';

@Component({
  selector: 'app-notification-or-item',
  imports: [MatCardModule, MatIconModule, FlexLayoutModule, NgClass, CreatedAgoPipe],
  templateUrl: './notification-or-item.html',
  styleUrl: './notification-or-item.scss',
})
export class NotificationORItem {
  @Input({ required: true }) notificationOR: NotificationOR;
  typeIcon = NOTIFICATION_OR_TYPE_ICON;
  typeIconClasses = NOTIFICATION_OR_TYPE_ICON_CLASSES;
  dateFormat = DATE_FORMAT.DEFAULT;

  private store = inject(Store<NotificationORState>);

  get message(): string {
    if (!this.notificationOR.type) return '';

    const splitedType = this.notificationOR.type.split('_')[2];
    const firstLetter = splitedType.charAt(0).toUpperCase();

    const formatedType = firstLetter + splitedType.slice(1);
    return `${formatedType} your request.`;
  }

  onSeen() {
    this.store.dispatch(
      NotificationORActions.seenNotificationsOR({
        notificationsSeenDto: { ids: [this.notificationOR.id] },
      }),
    );
  }
}
