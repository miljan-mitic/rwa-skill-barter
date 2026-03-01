import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { combineLatest, filter, Observable } from 'rxjs';
import { OfferRequest } from '../../../../common/models/offer-request.model';
import { Store } from '@ngrx/store';
import { OfferRequestState } from '../../store/offer-request.state';
import {
  selectOfferRequestFilter,
  selectOfferRequestLength,
  selectOfferRequestList,
  selectOfferRequestLoading,
  selectOfferRequestPaginationParamas,
} from '../../store/offer-request.selectors';
import { PaginationParams } from '../../../../common/interfaces/pagination-params.interface';
import { selectCurrentUser } from '../../../user/state/user.selector';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OfferRequestActions } from '../../store/offer-request.actions';
import { Role } from '../../../../common/enums/role.enum';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AsyncPipe, NgClass } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { Loader } from '../../../../shared/components/loader/loader';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { OfferRequestItem } from '../offer-request-item/offer-request-item';
import { OFFER_REQUEST_STATUS_CLASSES } from '../../../../common/constants/offer-request-status.consts';
import { FlexLayoutModule } from '@angular/flex-layout';
import { selectIdFromRouteParams } from '../../../../store/app.selector';

@Component({
  selector: 'app-offer-request-list',
  imports: [
    MatCardModule,
    MatListModule,
    MatPaginatorModule,
    FlexLayoutModule,
    AsyncPipe,
    NgClass,
    OfferRequestItem,
    Loader,
    EmptyState,
  ],
  templateUrl: './offer-request-list.html',
  styleUrl: './offer-request-list.scss',
})
export class OfferRequestList implements OnInit {
  statusClasses = OFFER_REQUEST_STATUS_CLASSES;

  offerRequests$: Observable<OfferRequest[]>;
  length$: Observable<number>;
  paginationParams$: Observable<PaginationParams>;
  loading$: Observable<boolean>;

  private destroyRef = inject(DestroyRef);
  private store = inject(Store<OfferRequestState>);

  ngOnInit(): void {
    this.loadOfferRequests();

    this.length$ = this.store.select(selectOfferRequestLength);
    this.paginationParams$ = this.store.select(selectOfferRequestPaginationParamas);
    this.loading$ = this.store.select(selectOfferRequestLoading);
  }

  private loadOfferRequests() {
    combineLatest([
      this.store.select(selectIdFromRouteParams),
      this.store.select(selectOfferRequestFilter),
      this.store.select(selectCurrentUser),
    ])
      .pipe(
        filter(([id, _, user]) => !!id && !!user),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([offerId, filter, user]) => {
        this.store.dispatch(
          OfferRequestActions.loadOfferRequests({
            offerRequestFilterDto: {
              ...filter,
              ...(offerId && offerId !== '' ? { offerId: +offerId } : {}),
            },
            ...(user?.role === Role.ADMIN ? { isAdmin: true } : {}),
          }),
        );
      });

    this.offerRequests$ = this.store.select(selectOfferRequestList);
  }

  getData(pageEvent: PageEvent) {
    this.store.dispatch(
      OfferRequestActions.changeOfferRequestFilter({
        filter: { page: pageEvent.pageIndex, pageSize: pageEvent.pageSize },
      }),
    );
  }
}
