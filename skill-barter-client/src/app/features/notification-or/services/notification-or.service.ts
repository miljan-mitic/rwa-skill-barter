import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponse } from '../../../common/interfaces/page-result.interface';
import { NotificationORFilterDto } from '../dtos/notification-or-filter.dto';
import { NotificationOR } from '../../../common/models/notification-or.model';
import { NotificationsSeenDto } from '../dtos/notifications-or-seen.dto';

@Injectable({ providedIn: 'root' })
export class NotificationORService {
  private readonly apiUrl = `${environment.api}/notifications-or`;
  private readonly httpClient = inject(HttpClient);

  seen(notificationsSeenDto: NotificationsSeenDto): Observable<NotificationOR[]> {
    return this.httpClient.patch<NotificationOR[]>(`${this.apiUrl}/seen`, notificationsSeenDto);
  }

  get(
    notificationORFilterDto: NotificationORFilterDto,
    isAdmin = false,
  ): Observable<PageResponse<NotificationOR>> {
    let params = new HttpParams();
    Object.keys(notificationORFilterDto).forEach((key) => {
      const value = notificationORFilterDto[key as keyof NotificationORFilterDto];
      if (value !== null && value !== undefined) {
        params = params.set(key, value.toString());
      }
    });
    return this.httpClient.get<PageResponse<NotificationOR>>(
      this.apiUrl + (isAdmin ? '/admin' : ''),
      {
        params,
      },
    );
  }

  getNumberUnseen(): Observable<{ numberUnseen: number }> {
    return this.httpClient.get<{ numberUnseen: number }>(`${this.apiUrl}/number-unseen`);
  }
}
