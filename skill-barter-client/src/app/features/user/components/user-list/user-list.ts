import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Loader } from '../../../../shared/components/loader/loader';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { UserItem } from '../user-item/user-item';
import { Observable } from 'rxjs';
import { User } from '../../../../common/models/user.model';
import { PaginationParams } from '../../../../common/interfaces/pagination-params.interface';
import { Store } from '@ngrx/store';
import { UserState } from '../../state/user.state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  selectUserFilter,
  selectUserLength,
  selectUserList,
  selectUserLoading,
  selectUserPaginationParams,
} from '../../state/user.selectors';
import { UserActions } from '../../state/user.actions';

@Component({
  selector: 'app-user-list',
  imports: [
    MatCardModule,
    MatListModule,
    MatPaginatorModule,
    FlexLayoutModule,
    AsyncPipe,
    Loader,
    EmptyState,
    UserItem,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList {
  users$: Observable<User[]>;
  length$: Observable<number>;
  paginationParams$: Observable<PaginationParams<User>>;
  loading$: Observable<boolean>;

  private destroyRef = inject(DestroyRef);
  private store = inject(Store<UserState>);

  ngOnInit(): void {
    this.loadUsers();

    this.length$ = this.store.select(selectUserLength);
    this.paginationParams$ = this.store.select(selectUserPaginationParams);
    this.loading$ = this.store.select(selectUserLoading);
  }

  private loadUsers() {
    this.store
      .select(selectUserFilter)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((filter) => {
        this.store.dispatch(
          UserActions.loadUsers({
            userFilterDto: filter || {},
          }),
        );
      });

    this.users$ = this.store.select(selectUserList);
  }

  getData(pageEvent: PageEvent) {
    this.store.dispatch(
      UserActions.changeUserFilter({
        filter: { page: pageEvent.pageIndex, pageSize: pageEvent.pageSize },
      }),
    );
  }
}
