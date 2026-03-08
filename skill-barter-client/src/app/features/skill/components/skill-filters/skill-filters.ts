import {
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, Observable } from 'rxjs';
import { SkillFilter, SkillState } from '../../store/skill.state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkillActions } from '../../store/skill.actions';
import { CategoryService } from '../../../category/services/category.service';
import { Category } from '../../../../common/models/category.model';
import { FilterParams } from '../../../../common/types/filter-params.type';
import { CategoryFilterDto } from '../../../category/dtos/category-filter.dto';
import { PageResponse } from '../../../../common/interfaces/page-result.interface';
import { RemoteSearchableSelect } from '../../../../shared/components/remote-searchable-select/remote-searchable-select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-skill-filters',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FlexLayoutModule,
    FormsModule,
    RouterLink,
    RemoteSearchableSelect,
  ],
  templateUrl: './skill-filters.html',
  styleUrl: './skill-filters.scss',
})
export class SkillFilters {
  private search$ = new BehaviorSubject<string>('');
  category = signal<Category | null>(null);

  @ViewChild('searchInput') searchInput: ElementRef;

  private destroyRef = inject(DestroyRef);
  private store = inject(Store<SkillState>);
  private categoryService = inject(CategoryService);

  constructor() {
    this.changedCategory();
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

  ngOnInit(): void {
    this.search$
      .pipe(
        debounceTime(500),
        filter((value) => value.length >= 3 || value === ''),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => {
        this.changeFilter({ search: value !== '' ? value : undefined });
      });
  }

  onSearch(value: string) {
    this.search$.next(value);
  }

  categoryLabel = (item: Category) => item.name;
  trackCategory = (item: Category) => item.id;
  fetchCategoryFn = (
    params: FilterParams<Category, CategoryFilterDto>,
  ): Observable<PageResponse<Category>> => {
    return this.categoryService.get(params);
  };

  private changeFilter(filter: SkillFilter) {
    this.store.dispatch(SkillActions.changeSkillFilter({ filter }));
  }

  private restartFilterValues() {
    this.category.set(null);
    const inputEl = this.searchInput?.nativeElement;
    if (inputEl?.value) {
      inputEl.value = '';
    }
  }

  clearFilters() {
    this.restartFilterValues();
    this.changeFilter({
      categoryId: undefined,
      search: undefined,
    });
  }
}
