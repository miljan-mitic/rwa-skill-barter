import { Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { SkillService } from '../../../skill/services/skill.service';
import { CategoryService } from '../../../category/category.service';
import { OfferFilter, OfferState } from '../../store/offer.state';
import { Store } from '@ngrx/store';
import { Category } from '../../../../common/models/category.model';
import { PageResponse } from '../../../../common/interfaces/page-result.interface';
import { FilterParams } from '../../../../common/types/filter-params.type';
import { CategoryFilterDto } from '../../../category/dtos/category-filter.dto';
import { Observable, tap } from 'rxjs';
import { Skill } from '../../../../common/models/skill.model';
import { SkillFilterDto } from '../../../skill/dtos/skill-filter.dto';
import { MatCardModule } from '@angular/material/card';
import { RemoteSearchableSelect } from '../../../../shared/components/remote-select/remote-searchable-select';
import { FormsModule } from '@angular/forms';
import { OfferActions } from '../../store/offer.actions';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { OfferMeetingType } from '../../../../common/enums/offer-meeting-type.enum';
import { selectOfferGlobal } from '../../store/offer.selectors';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-offer-filters',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    RemoteSearchableSelect,
    FormsModule,
    FlexLayoutModule,
    AsyncPipe,
    RouterLink,
  ],
  templateUrl: './offer-filters.html',
  styleUrl: './offer-filters.scss',
})
export class OfferFilters implements OnInit {
  meetingTypes: string[] = Object.values(OfferMeetingType);
  @ViewChild('meetingTypeSelect') meetingTypeSelect: MatSelect;

  category = signal<Category | null>(null);
  skill = signal<Skill | null>(null);

  global$: Observable<boolean | undefined>;

  private skillService = inject(SkillService);
  private categoryService = inject(CategoryService);
  private store = inject(Store<OfferState>);

  ngOnInit(): void {
    this.global$ = this.store.select(selectOfferGlobal).pipe(tap(() => this.restartFilterValues()));
  }

  constructor() {
    this.changedCategory();
    this.changedSkill();
  }

  private changedCategory() {
    effect(() => {
      const category = this.category();

      if (!category) {
        return;
      }

      this.changeFilter({ categoryId: category.id });
    });
  }

  private changedSkill() {
    effect(() => {
      const skill = this.skill();

      if (!skill) {
        return;
      }

      this.changeFilter({ skillId: skill.id });
    });
  }

  private changeFilter(filter: OfferFilter) {
    this.store.dispatch(OfferActions.changeOfferFilter({ filter }));
  }

  private restartFilterValues() {
    this.category.set(null);
    this.skill.set(null);
    if (this.meetingTypeSelect?.value) {
      this.meetingTypeSelect.value = undefined;
    }
  }

  categoryLabel = (item: Category) => item.name;
  trackCategory = (item: Category) => item.id;
  fetchCategoryFn = (
    params: FilterParams<CategoryFilterDto>,
  ): Observable<PageResponse<Category>> => {
    return this.categoryService.get(params);
  };

  skillLabel = (item: Skill) => item.name;
  trackSkill = (item: Skill) => item.id;
  fetchSkillFn = (params: FilterParams<SkillFilterDto>): Observable<PageResponse<Skill>> => {
    return this.skillService.get(params);
  };

  changeMeetingType(meetingType: OfferMeetingType) {
    this.changeFilter({ meetingType });
  }

  clearFilters() {
    this.restartFilterValues();
    this.changeFilter({ categoryId: undefined, skillId: undefined, meetingType: undefined });
  }
}
