import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, filter, Observable, Subscription } from 'rxjs';
import { Offer } from '../../../../common/models/offer.model';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../../user/state/user.selector';
import { Role } from '../../../../common/enums/role.enum';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PaginationParams } from '../../../../common/interfaces/pagination-params.interface';
import { AsyncPipe } from '@angular/common';
import { PAGINATION_PARAMS_INITIAL } from '../../../../common/constants/pagination-params.const';
import { OfferState } from '../../store/offer.state';
import { OfferActions } from '../../store/offer.actions';
import { selectOfferFilter, selectOfferLength, selectOfferList } from '../../store/offer.selectors';
import { OfferItem } from '../offer-item/offer-item';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-offer-list',
  imports: [MatListModule, MatPaginatorModule, AsyncPipe, OfferItem, FlexLayoutModule],
  templateUrl: './offer-list.html',
  styleUrl: './offer-list.scss',
})
export class OfferList implements OnInit, OnDestroy {
  offers$: Observable<Offer[]>;
  length$: Observable<number>;

  paginationParams: PaginationParams = {
    page: PAGINATION_PARAMS_INITIAL.PAGE,
    pageSize: PAGINATION_PARAMS_INITIAL.PAGE_SIZE,
  };

  filterSubscription: Subscription;

  constructor(private readonly store: Store<OfferState>) {}

  ngOnInit(): void {
    this.store.dispatch(
      OfferActions.changeOfferPaginationFilter({ paginationParams: this.paginationParams }),
    );

    this.filterSubscription = combineLatest([
      this.store.select(selectOfferFilter),
      this.store.select(selectCurrentUser),
    ])
      .pipe(filter(([_, user]) => !!user))
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
  }

  ngOnDestroy(): void {
    this.filterSubscription.unsubscribe();
  }

  getData(pageEvent: PageEvent) {
    this.store.dispatch(
      OfferActions.changeOfferPaginationFilter({
        paginationParams: { page: pageEvent.pageIndex, pageSize: pageEvent.pageSize },
      }),
    );
  }
}
