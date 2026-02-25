import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
import { User } from '../../../common/models/user.model';
import { AuthActions } from '../../../features/auth/store/auth.actions';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NgTemplateOutlet } from '@angular/common';
import { selectCurrentUser } from '../../../features/user/state/user.selector';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppState } from '../../../store/app.state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OfferActions } from '../../../features/offer/store/offer.actions';
import { initialStateOfferFilter } from '../../../features/offer/store/offer.reducer';
import { OfferStatus } from '../../../common/enums/offer-status.enum';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    MatToolbarModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    NgTemplateOutlet,
    MatFormFieldModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  user: User;

  private store = inject(Store<AppState>);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.store
      .select(selectCurrentUser)
      .pipe(
        filter((user) => !!user),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((user) => {
        this.user = user;
      });
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
