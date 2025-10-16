import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { NotificationSeverity } from '../../common/enums/notification.enums';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private messageService: MessageService) {}

  showMessage(severity: NotificationSeverity, summary: string, detail: string) {
    this.messageService.add({
      severity,
      summary,
      detail,
    });
  }
}
