import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { combineLatest, filter, Observable } from 'rxjs';
import { Skill } from '../../../../common/models/skill.model';
import { Store } from '@ngrx/store';
import { SkillState } from '../../store/skill.state';
import { selectSkillFilter, selectSkillLength, selectSkillList } from '../../store/skill.selector';
import { PaginationParams } from '../../../../common/interfaces/pagination-params.interface';
import { PAGINATION_PARAMS_INITIAL } from '../../../../common/constants/pagination-params.const';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SkillActions } from '../../store/skill.actions';
import { selectCurrentUser } from '../../../user/state/user.selector';
import { Role } from '../../../../common/enums/role.enum';
import { MatListModule } from '@angular/material/list';
import { AsyncPipe } from '@angular/common';
import { SkillItem } from '../skill-item/skill-item';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-skill-list',
  imports: [
    MatListModule,
    MatPaginatorModule,
    MatIconModule,
    AsyncPipe,
    SkillItem,
    FlexLayoutModule,
    RouterLink,
  ],
  templateUrl: './skill-list.html',
  styleUrl: './skill-list.scss',
})
export class SkillList implements OnInit {
  private store = inject(Store<SkillState>);
  private destroyRef = inject(DestroyRef);

  skills$: Observable<Skill[]>;
  length$: Observable<number>;

  paginationParams: PaginationParams = {
    page: PAGINATION_PARAMS_INITIAL.PAGE,
    pageSize: PAGINATION_PARAMS_INITIAL.PAGE_SIZE,
  };

  ngOnInit(): void {
    this.store.dispatch(
      SkillActions.changeSkillPaginationFilter({ paginationParams: this.paginationParams }),
    );

    combineLatest([this.store.select(selectSkillFilter), this.store.select(selectCurrentUser)])
      .pipe(
        filter(([_, user]) => !!user),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([filter, user]) => {
        this.store.dispatch(
          SkillActions.loadSkills({
            skillFilterDto: filter || {},
            ...(user?.role === Role.ADMIN && { isAdmin: true }),
          }),
        );
      });

    this.skills$ = this.store.select(selectSkillList);
    this.length$ = this.store.select(selectSkillLength);
  }

  getData(pageEvent: PageEvent) {
    this.store.dispatch(
      SkillActions.changeSkillPaginationFilter({
        paginationParams: { page: pageEvent.pageIndex, pageSize: pageEvent.pageSize },
      }),
    );
  }
}
