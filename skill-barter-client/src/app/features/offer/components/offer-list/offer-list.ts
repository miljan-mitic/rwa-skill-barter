import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, filter, Observable, Subscription } from 'rxjs';
import { Offer } from '../../../../common/models/offer.model';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../../user/state/user.selector';
import { Role } from '../../../../common/enums/role.enum';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AsyncPipe } from '@angular/common';
import { OfferFilter, OfferState } from '../../store/offer.state';
import { OfferActions } from '../../store/offer.actions';
import {
  selectOfferFilter,
  selectOfferLength,
  selectOfferList,
  selectOfferLoading,
} from '../../store/offer.selectors';
import { OfferItem } from '../offer-item/offer-item';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Loader } from '../../../../shared/components/loader/loader';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-offer-list',
  imports: [
    MatCardModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    FlexLayoutModule,
    RouterLink,
    OfferItem,
    EmptyState,
    Loader,
  ],
  templateUrl: './offer-list.html',
  styleUrl: './offer-list.scss',
})
export class OfferList implements OnInit {
  private store = inject(Store<OfferState>);
  private destroyRef = inject(DestroyRef);

  offers$: Observable<Offer[]>;
  length$: Observable<number>;
  filter$: Observable<OfferFilter>;
  loading$: Observable<boolean>;

  ngOnInit(): void {
    combineLatest([this.store.select(selectOfferFilter), this.store.select(selectCurrentUser)])
      .pipe(
        filter(([_, user]) => !!user),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([filter, user]) => {
        this.store.dispatch(
          OfferActions.loadOffers({
            offerFilterDto: filter || {},
            ...(user?.role === Role.ADMIN ? { isAdmin: true } : {}),
          }),
        );
      });

    this.offers$ = this.store.select(selectOfferList);
    this.length$ = this.store.select(selectOfferLength);
    this.filter$ = this.store.select(selectOfferFilter);
    this.loading$ = this.store.select(selectOfferLoading);
  }

  getData(pageEvent: PageEvent) {
    this.store.dispatch(
      OfferActions.changeOfferPaginationFilter({
        paginationParams: { page: pageEvent.pageIndex, pageSize: pageEvent.pageSize },
      }),
    );
  }
}
