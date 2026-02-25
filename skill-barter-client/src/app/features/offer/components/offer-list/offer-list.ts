import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { combineLatest, filter, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../../user/state/user.selector';
import { Role } from '../../../../common/enums/role.enum';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AsyncPipe, NgClass } from '@angular/common';
import { OfferState } from '../../store/offer.state';
import { OfferActions } from '../../store/offer.actions';
import {
  selectOfferFilter,
  selectOfferGlobal,
  selectOfferLength,
  selectOfferList,
  selectOfferLoading,
  selectOfferPaginationParamas,
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
import { OFFER_STATUS_CLASSES } from '../../../../common/constants/offer-status.consts';
import { PaginationParams } from '../../../../common/interfaces/pagination-params.interface';
import { Offer } from '../../../../common/models/offer.model';

@Component({
  selector: 'app-offer-list',
  imports: [
    MatCardModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    NgClass,
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
  statusClasses = OFFER_STATUS_CLASSES;

  private store = inject(Store<OfferState>);
  private destroyRef = inject(DestroyRef);

  offers$: Observable<Offer[]>;
  length$: Observable<number>;
  paginationParams$: Observable<PaginationParams>;
  loading$: Observable<boolean>;
  global$: Observable<boolean | undefined>;

  ngOnInit(): void {
    this.loadOffers();

    this.length$ = this.store.select(selectOfferLength);
    this.paginationParams$ = this.store.select(selectOfferPaginationParamas);
    this.loading$ = this.store.select(selectOfferLoading);
    this.global$ = this.store.select(selectOfferGlobal);
  }

  private loadOffers() {
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
  }

  getData(pageEvent: PageEvent) {
    this.store.dispatch(
      OfferActions.changeOfferFilter({
        filter: { page: pageEvent.pageIndex, pageSize: pageEvent.pageSize },
      }),
    );
  }
}
