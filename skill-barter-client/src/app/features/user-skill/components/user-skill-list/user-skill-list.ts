import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Store } from '@ngrx/store';
import { UserSkillFilter, UserSkillState } from '../../store/user-skill.state';
import { combineLatest, filter, Observable } from 'rxjs';
import { UserSkill } from '../../../../common/models/user-skill.model';
import { UserSkillActions } from '../../store/user-skill.actions';
import {
  selectUserSkillFilter,
  selectUserSkillLength,
  selectUserSkillList,
  selectUserSkillLoading,
} from '../../store/user-skill.selector';
import { selectCurrentUser } from '../../../user/state/user.selector';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Role } from '../../../../common/enums/role.enum';
import { UserSkillItem } from '../user-skill-item/user-skill-item';
import { MatIconModule } from '@angular/material/icon';
import { Loader } from '../../../../shared/components/loader/loader';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-skill-list',
  imports: [
    MatListModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    AsyncPipe,
    UserSkillItem,
    FlexLayoutModule,
    RouterLink,
    Loader,
    EmptyState,
  ],
  templateUrl: './user-skill-list.html',
  styleUrl: './user-skill-list.scss',
})
export class UserSkillList implements OnInit {
  private store = inject(Store<UserSkillState>);
  private destroyRef = inject(DestroyRef);

  userSkills$: Observable<UserSkill[]>;
  length$: Observable<number>;
  filter$: Observable<UserSkillFilter>;
  loading$: Observable<boolean>;

  ngOnInit(): void {
    combineLatest([this.store.select(selectUserSkillFilter), this.store.select(selectCurrentUser)])
      .pipe(
        filter(([_, user]) => !!user),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([filter, user]) => {
        this.store.dispatch(
          UserSkillActions.loadUserSkills({
            userSkillFilterDto: { ...filter, userId: user?.id },
            ...(user?.role === Role.ADMIN && { isAdmin: true }),
          }),
        );
      });

    this.userSkills$ = this.store.select(selectUserSkillList);
    this.length$ = this.store.select(selectUserSkillLength);
    this.filter$ = this.store.select(selectUserSkillFilter);
    this.loading$ = this.store.select(selectUserSkillLoading);
  }

  getData(pageEvent: PageEvent) {
    this.store.dispatch(
      UserSkillActions.changeUserSkillPaginationFilter({
        paginationParams: { page: pageEvent.pageIndex, pageSize: pageEvent.pageSize },
      }),
    );
  }
}
