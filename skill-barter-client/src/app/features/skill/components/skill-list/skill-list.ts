import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Loader } from '../../../../shared/components/loader/loader';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { Observable } from 'rxjs';
import { Skill } from '../../../../common/models/skill.model';
import { PaginationParams } from '../../../../common/interfaces/pagination-params.interface';
import { Store } from '@ngrx/store';
import { SkillState } from '../../store/skill.state';
import {
  selectSkillFilter,
  selectSkillLength,
  selectSkillList,
  selectSkillLoading,
  selectSkillPaginationParams,
} from '../../store/skill.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkillActions } from '../../store/skill.actions';
import { SkillItem } from '../skill-item/skill-item';

@Component({
  selector: 'app-skill-list',
  imports: [
    MatCardModule,
    MatListModule,
    MatPaginatorModule,
    FlexLayoutModule,
    AsyncPipe,
    Loader,
    EmptyState,
    SkillItem,
  ],
  templateUrl: './skill-list.html',
  styleUrl: './skill-list.scss',
})
export class SkillList {
  skills$: Observable<Skill[]>;
  length$: Observable<number>;
  paginationParams$: Observable<PaginationParams<Skill>>;
  loading$: Observable<boolean>;

  private destroyRef = inject(DestroyRef);
  private store = inject(Store<SkillState>);

  ngOnInit(): void {
    this.loadSkills();

    this.length$ = this.store.select(selectSkillLength);
    this.paginationParams$ = this.store.select(selectSkillPaginationParams);
    this.loading$ = this.store.select(selectSkillLoading);
  }

  private loadSkills() {
    this.store
      .select(selectSkillFilter)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((filter) => {
        this.store.dispatch(
          SkillActions.loadSkills({
            skillFilterDto: filter || {},
          }),
        );
      });

    this.skills$ = this.store.select(selectSkillList);
  }

  getData(pageEvent: PageEvent) {
    this.store.dispatch(
      SkillActions.changeSkillFilter({
        filter: { page: pageEvent.pageIndex, pageSize: pageEvent.pageSize },
      }),
    );
  }
}
