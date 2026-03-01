import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { concat, filter, map, Observable, of, switchMap, timer } from 'rxjs';
import { User } from '../../../common/models/user.model';
import { AuthActions } from '../../../features/auth/store/auth.actions';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { selectCurrentUser } from '../../../features/user/state/user.selector';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppState } from '../../../store/app.state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OfferActions } from '../../../features/offer/store/offer.actions';
import { initialStateOfferFilter } from '../../../features/offer/store/offer.reducer';
import { OfferStatus } from '../../../common/enums/offer-status.enum';
import { NotificationORActions } from '../../../features/notification-or/store/notification-or.actions';
import { selectNotificationORNumberUnseen } from '../../../features/notification-or/store/notification-or.selectors';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatBadgeModule,
    MatMenuModule,
    RouterLink,
    AsyncPipe,
    FlexLayoutModule,
    NgTemplateOutlet,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  user?: User;
  notificationORNumberUnseen$: Observable<number | undefined>;
  displayNumberUnseen: string;
  pulse$: Observable<boolean>;
  private lastNumberUnseen = 0;

  private destroyRef = inject(DestroyRef);
  private store = inject(Store<AppState>);

  ngOnInit(): void {
    this.loadNumberUnseenNotificationsOR();
  }

  private loadNumberUnseenNotificationsOR() {
    this.store
      .select(selectCurrentUser)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        this.user = user;
        this.store.dispatch(NotificationORActions.loadNumberUnseenNotificationsOR());
      });

    this.notificationORNumberUnseen$ = this.store.select(selectNotificationORNumberUnseen);

    this.notificationORNumberUnseen$
      .pipe(
        filter((numberUnseen) => numberUnseen !== undefined),
        map((numberUnseen) => (numberUnseen > 99 ? '99+' : numberUnseen?.toString())),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((displayNumberUnseen) => {
        this.displayNumberUnseen = displayNumberUnseen;
      });

    this.pulse$ = this.notificationORNumberUnseen$.pipe(
      filter((numberUnseen) => numberUnseen !== undefined),
      map((numberUnseen) => {
        const shouldPulse = numberUnseen > this.lastNumberUnseen;
        this.lastNumberUnseen = numberUnseen;
        return shouldPulse;
      }),
      switchMap((shouldPulse) => {
        if (!shouldPulse) {
          return of(false);
        }

        return concat(of(true), timer(1000).pipe(map(() => false)));
      }),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  resetOfferFilter() {
    this.store.dispatch(
      OfferActions.changeOfferFilter({
        filter: {
          ...initialStateOfferFilter,
          global: true,
          userOffers: false,
          status: OfferStatus.ACTIVE,
        },
      }),
    );
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
