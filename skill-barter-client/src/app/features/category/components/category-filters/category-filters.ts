import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { CategoryState } from '../../store/category.state';
import { CategoryActions } from '../../store/category.actions';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-filters',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FlexLayoutModule,
    RouterLink,
  ],
  templateUrl: './category-filters.html',
  styleUrl: './category-filters.scss',
})
export class CategoryFilters implements OnInit {
  private search$ = new BehaviorSubject<string>('');

  private destroyRef = inject(DestroyRef);
  private store = inject(Store<CategoryState>);

  ngOnInit(): void {
    this.search$
      .pipe(
        debounceTime(500),
        filter((value) => value.length >= 3 || value === ''),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => {
        if (value === '') {
          this.store.dispatch(CategoryActions.restartCategoryFilter());
          return;
        }
        this.store.dispatch(
          CategoryActions.changeCategoryFilter({
            filter: {
              search: value,
            },
          }),
        );
      });
  }

  onSearch(value: string) {
    this.search$.next(value);
  }
}
