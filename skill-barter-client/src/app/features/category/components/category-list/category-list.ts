import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Loader } from '../../../../shared/components/loader/loader';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { Observable } from 'rxjs';
import { Category } from '../../../../common/models/category.model';
import { PaginationParams } from '../../../../common/interfaces/pagination-params.interface';
import { Store } from '@ngrx/store';
import { CategoryState } from '../../store/category.state';
import {
  selectCategoryFilter,
  selectCategoryLength,
  selectCategoryList,
  selectCategoryLoading,
  selectCategoryPaginationParams,
} from '../../store/category.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategoryActions } from '../../store/category.actions';
import { CategoryItem } from '../category-item/category-item';

@Component({
  selector: 'app-category-list',
  imports: [
    MatCardModule,
    MatListModule,
    MatPaginatorModule,
    FlexLayoutModule,
    AsyncPipe,
    Loader,
    EmptyState,
    CategoryItem,
  ],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
})
export class CategoryList implements OnInit {
  categories$: Observable<Category[]>;
  length$: Observable<number>;
  paginationParams$: Observable<PaginationParams<Category>>;
  loading$: Observable<boolean>;

  private destroyRef = inject(DestroyRef);
  private store = inject(Store<CategoryState>);

  ngOnInit(): void {
    this.loadCategories();

    this.length$ = this.store.select(selectCategoryLength);
    this.paginationParams$ = this.store.select(selectCategoryPaginationParams);
    this.loading$ = this.store.select(selectCategoryLoading);
  }

  private loadCategories() {
    this.store
      .select(selectCategoryFilter)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((filter) => {
        this.store.dispatch(
          CategoryActions.loadCategories({
            categoryFilterDto: filter || {},
          }),
        );
      });

    this.categories$ = this.store.select(selectCategoryList);
  }

  getData(pageEvent: PageEvent) {
    this.store.dispatch(
      CategoryActions.changeCategoryFilter({
        filter: { page: pageEvent.pageIndex, pageSize: pageEvent.pageSize },
      }),
    );
  }
}
