import { DestroyRef, inject, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Store } from '@ngrx/store';
import { Observable, distinctUntilChanged, filter } from 'rxjs';
import { selectToken } from '../../../features/auth/store/auth.selectors';
import { environment } from '../../../../environments/environment';
import { AppState } from '../../../store/app.state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SocketEventType } from '../../../common/enums/socket-event-type.enum';
import { SocketActions } from '../store/socket.actions';
import { SocketNamespaces } from '../../../common/enums/socket-namespaces.enum';

@Injectable({ providedIn: 'root' })
export class SocketManagerService {
  private callSocket?: Socket;
  private notificationSocket?: Socket;

  private store = inject(Store<AppState>);
  private destroyRef = inject(DestroyRef);

  async connect() {
    this.store
      .select(selectToken)
      .pipe(
        filter((token) => !!token),
        distinctUntilChanged(
          (previous: string | undefined, current: string | undefined) => previous !== current,
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((token) => {
        if (!token) return;

        this.disconnect();

        this.initCallSocket(token);
        this.initNotificationSocket(token);

        this.store.dispatch(SocketActions.initializedSocket());
      });
  }

  private initCallSocket(token: string) {
    this.callSocket = io(`${environment.api}${SocketNamespaces.CALL}`, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      auth: { token },
    });
  }

  private initNotificationSocket(token: string) {
    this.notificationSocket = io(`${environment.api}${SocketNamespaces.NOTIFICATION_OR}`, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      auth: { token },
    });
  }

  disconnect() {
    if (this.callSocket?.connected) {
      this.callSocket?.disconnect();
    }
    if (this.notificationSocket?.connected) {
      this.notificationSocket?.disconnect();
    }
  }

  onNotification<T>(eventType: SocketEventType): Observable<T> {
    return new Observable((observer) => {
      const handler = (notification: T) => observer.next(notification);

      this.notificationSocket?.on(eventType, handler);

      return () => {
        this.notificationSocket?.off(eventType, handler);
      };
    });
  }

  // emitCall(event: string, data: any) {
  //   this.callSocket?.emit(event, data);
  // }

  // onCall<T>(event: string): Observable<T> {
  //   return new Observable((observer) => {
  //     this.callSocket?.on(event, (data: T) => observer.next(data));

  //     return () => this.callSocket?.off(event);
  //   });
  // }

  getMessages(): Observable<any> {
    // return this.callSocket?.fromEvent('message');

    return new Observable((observer) => {
      this.callSocket?.on('message', (data: any) => observer.next(data));

      return () => this.callSocket?.off('message');
    });
  }

  sendMessage(payload: any): void {
    this.callSocket?.emit('send-message', payload);
  }
}
