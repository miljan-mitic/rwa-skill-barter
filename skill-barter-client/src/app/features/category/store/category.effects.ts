import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CategoryService } from '../services/category.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { catchError, EMPTY, exhaustMap, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { CategoryActions } from './category.actions';
import {
  NotificationSeverity,
  NotificationSummary,
} from '../../../common/enums/notification.enums';
import { HttpStatusCode } from '@angular/common/http';
import { AuthActions } from '../../auth/store/auth.actions';

@Injectable()
export class CategoryEffects {
  private readonly actions$ = inject(Actions);
  private readonly router = inject(Router);
  private readonly categoryService = inject(CategoryService);
  private readonly notificationService = inject(NotificationService);

  createCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.createCategory),
      exhaustMap(({ categoryDto }) =>
        this.categoryService.create(categoryDto).pipe(
          map((category) => CategoryActions.createCategorySuccess({ category })),
          catchError((error) => of(CategoryActions.createCategoryFailure(error))),
        ),
      ),
    ),
  );

  createCategorySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CategoryActions.createCategorySuccess),
        tap(() => {
          this.router.navigate(['/admin/categories']);
          this.notificationService.showMessage(
            NotificationSeverity.SUCCESS,
            NotificationSummary.SUCCESS,
            'Category added successfully',
          );
        }),
      ),
    { dispatch: false },
  );

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.loadCategories),
      switchMap(({ categoryFilterDto }) =>
        this.categoryService.get(categoryFilterDto).pipe(
          map(({ items, totalItems }) =>
            CategoryActions.loadCategoriesSuccess({ categories: items, length: totalItems }),
          ),
          catchError((error) => of(CategoryActions.loadCategoriesFailure(error))),
        ),
      ),
    ),
  );

  deleteCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.deleteCategory),
      mergeMap(({ id }) =>
        this.categoryService.delete(id).pipe(
          map(() => CategoryActions.deleteCategorySuccess()),
          catchError((error) => of(CategoryActions.deleteCategoryFailure(error))),
        ),
      ),
    ),
  );

  deleteCategorySuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.deleteCategorySuccess),
      tap(() => {
        this.router.navigate(['/admin/categories']);
        this.notificationService.showMessage(
          NotificationSeverity.SUCCESS,
          NotificationSummary.SUCCESS,
          'Category deleted successfully',
        );
      }),
      map(() => CategoryActions.changeCategoryFilter({ filter: {} })),
    ),
  );

  categoryFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CategoryActions.createCategoryFailure,
        CategoryActions.loadCategoriesFailure,
        CategoryActions.deleteCategoryFailure,
      ),
      mergeMap(({ error }) => {
        console.error('Category Error:', error);
        if (error?.statusCode === HttpStatusCode.Unauthorized) {
          return of(AuthActions.unauthorizedAccess());
        }

        this.notificationService.showMessage(
          NotificationSeverity.ERROR,
          NotificationSummary.ERROR,
          error?.message || 'An unexpected error occurred',
        );

        return EMPTY;
      }),
    ),
  );
}
