import { Component, DestroyRef, ElementRef, inject, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { UserFilter, UserState } from '../../state/user.state';
import { UserActions } from '../../state/user.actions';

@Component({
  selector: 'app-user-filters',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FlexLayoutModule,
    FormsModule,
  ],
  templateUrl: './user-filters.html',
  styleUrl: './user-filters.scss',
})
export class UserFilters {
  private search$ = new BehaviorSubject<string>('');

  @ViewChild('searchInput') searchInput: ElementRef;

  @ViewChild('ratingAvgMinInput') ratingAvgMinInput: ElementRef;
  @ViewChild('ratingAvgMaxInput') ratingAvgMaxInput: ElementRef;

  @ViewChild('ratingCountMinInput') ratingCountMinInput: ElementRef;
  @ViewChild('ratingCountMaxInput') ratingCountMaxInput: ElementRef;

  private destroyRef = inject(DestroyRef);
  private store = inject(Store<UserState>);

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

  applayRatingAvg() {
    const minValue = this.ratingAvgMinInput?.nativeElement?.value;
    const maxValue = this.ratingAvgMaxInput?.nativeElement?.value;
    this.changeFilter({
      ratingAvgMin: minValue && minValue !== '' ? minValue : undefined,
      ratingAvgMax: maxValue && maxValue !== '' ? maxValue : undefined,
    });
  }

  applayRatingCount() {
    const minValue = this.ratingCountMinInput?.nativeElement?.value;
    const maxValue = this.ratingCountMaxInput?.nativeElement?.value;
    this.changeFilter({
      ratingCountMin: minValue && minValue !== '' ? minValue : undefined,
      ratingCountMax: maxValue && maxValue !== '' ? maxValue : undefined,
    });
  }

  private changeFilter(filter: UserFilter) {
    this.store.dispatch(UserActions.changeUserFilter({ filter }));
  }

  private restartFilterValues() {
    const searchEl = this.searchInput?.nativeElement;
    if (searchEl?.value) {
      searchEl.value = '';
    }

    const minAvgEl = this.ratingAvgMinInput?.nativeElement;
    if (minAvgEl?.value) {
      minAvgEl.value = null;
    }

    const maxAvgEl = this.ratingAvgMaxInput?.nativeElement;
    if (maxAvgEl?.value) {
      maxAvgEl.value = null;
    }

    const minCountEl = this.ratingCountMinInput?.nativeElement;
    if (minCountEl?.value) {
      minCountEl.value = null;
    }

    const maxCountEl = this.ratingCountMaxInput?.nativeElement;
    if (maxCountEl?.value) {
      maxCountEl.value = null;
    }
  }

  clearFilters() {
    this.restartFilterValues();
    this.changeFilter({
      search: undefined,
      ratingAvgMin: undefined,
      ratingAvgMax: undefined,
      ratingCountMin: undefined,
      ratingCountMax: undefined,
    });
  }
}
