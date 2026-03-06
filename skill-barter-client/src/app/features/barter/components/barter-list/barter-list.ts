import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { BarterItem } from '../barter-item/barter-item';
import { Loader } from '../../../../shared/components/loader/loader';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { combineLatest, filter, Observable } from 'rxjs';
import { Barter } from '../../../../common/models/barter.model';
import { PaginationParams } from '../../../../common/interfaces/pagination-params.interface';
import { Store } from '@ngrx/store';
import { BarterState } from '../../store/barter.state';
import {
  selectBarterFilter,
  selectBarterLength,
  selectBarterList,
  selectBarterLoading,
  selectBarterPaginationParams,
} from '../../store/barter.selectors';
import { selectCurrentUser } from '../../../user/state/user.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BarterActions } from '../../store/barter.actions';
import { Role } from '../../../../common/enums/role.enum';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-barter-list',
  imports: [
    MatCardModule,
    MatListModule,
    MatPaginatorModule,
    FlexLayoutModule,
    AsyncPipe,
    BarterItem,
    Loader,
    EmptyState,
  ],
  templateUrl: './barter-list.html',
  styleUrl: './barter-list.scss',
})
export class BarterList {
  barters$: Observable<Barter[]>;
  length$: Observable<number>;
  paginationParams$: Observable<PaginationParams<Barter>>;
  loading$: Observable<boolean>;

  private destroyRef = inject(DestroyRef);
  private store = inject(Store<BarterState>);

  ngOnInit(): void {
    this.loadBarters();

    this.length$ = this.store.select(selectBarterLength);
    this.paginationParams$ = this.store.select(selectBarterPaginationParams);
    this.loading$ = this.store.select(selectBarterLoading);
  }

  private loadBarters() {
    combineLatest([this.store.select(selectBarterFilter), this.store.select(selectCurrentUser)])
      .pipe(
        filter(([_, user]) => !!user),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([filter, user]) => {
        this.store.dispatch(
          BarterActions.loadBarters({
            barterFilterDto: filter || {},
            ...(user?.role === Role.ADMIN ? { isAdmin: true } : {}),
          }),
        );
      });

    this.barters$ = this.store.select(selectBarterList);
  }

  getData(pageEvent: PageEvent) {
    this.store.dispatch(
      BarterActions.changeBarterFilter({
        filter: { page: pageEvent.pageIndex, pageSize: pageEvent.pageSize },
      }),
    );
  }
}
