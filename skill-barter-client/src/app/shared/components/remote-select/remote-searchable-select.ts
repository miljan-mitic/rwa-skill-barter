import {
  booleanAttribute,
  Component,
  DestroyRef,
  forwardRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  merge,
  Observable,
  scan,
  Subject,
  switchMap,
  takeUntil,
  tap,
  throttleTime,
} from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';
import { OverlayContainer } from '@angular/cdk/overlay';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PaginationParams } from '../../../common/interfaces/pagination-params.interface';
import { PageResponse } from '../../../common/interfaces/page-result.interface';
import { FilterParams } from '../../../common/types/filter-params.type';

@Component({
  selector: 'app-remote-searchable-select',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    AsyncPipe,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RemoteSearchableSelect),
      multi: true,
    },
  ],
  templateUrl: './remote-searchable-select.html',
  styleUrl: './remote-searchable-select.scss',
})
export class RemoteSearchableSelect<T, K extends PaginationParams>
  implements OnInit, ControlValueAccessor
{
  @Input({ required: true }) label: string;
  @Input() placeholder = 'Search...';
  @Input() maxPage = 5;
  @Input() pageSize = 5;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  private _extraFilters: Partial<K> | null = null;

  @Input()
  set extraFilters(value: Partial<K> | null) {
    const changed = JSON.stringify(this._extraFilters) !== JSON.stringify(value);
    this._extraFilters = value;

    if (changed) {
      this.page = 0;
      this.restartPage$.next();
    }
  }

  get extraFilters(): Partial<K> | null {
    return this._extraFilters;
  }

  @Input({ transform: booleanAttribute }) required = false;

  /**
   * Function to fetch data from the API.
   */
  @Input({ required: true }) fetchFn: (params: FilterParams<K>) => Observable<PageResponse<T>>;

  /**
   * Function to display the item in the input field.
   */
  @Input({ required: true }) displayFn: (item: T) => string;

  /**
   * Track by function for the list of items. Return a unique identifier for each item.
   */
  @Input({ required: true }) trackBy: (item: T) => string | number;

  items$!: Observable<T[]>;

  private loadNextPage$ = new Subject<void>();
  private restartPage$ = new Subject<void>();

  private search$ = new BehaviorSubject<string>('');
  loading$ = new BehaviorSubject<boolean>(false);

  private page = 0;
  private totalItems = 0;

  @ViewChild(MatSelect) matSelect: MatSelect;

  private overlayContainer = inject(OverlayContainer);
  private destroyRef = inject(DestroyRef);

  // ControlValueAccessor
  disabled = false;
  value: T | null = null;
  onChange = (_: T | null) => {};
  onTouched = () => {};

  ngOnInit(): void {
    const page$ = merge(
      this.restartPage$.pipe(map(() => 0)),
      this.loadNextPage$.pipe(
        filter(() => !this.loading$.value),
        map(() => ++this.page),
      ),
    );

    const search$ = this.search$.pipe(
      debounceTime(500),
      filter((value) => value.length >= 3 || value === ''),
      distinctUntilChanged(),
      tap(() => {
        this.page = 0;
        this.restartPage$.next();
      }),
    );

    this.items$ = combineLatest([search$, page$]).pipe(
      filter(() => !!this.fetchFn),
      tap(() => {
        this.loading$.next(true);
      }),
      delay(1000),
      switchMap(([search, page]) =>
        this.fetchFn({
          page,
          pageSize: this.pageSize,
          ...(search.trim() !== '' && {
            search,
          }),
          ...(this.extraFilters ?? {}),
        } as FilterParams<K>),
      ),
      tap((res) => {
        this.totalItems = res.totalItems;
        this.loading$.next(false);
      }),
      map((res) => res.items),
      scan((acc: T[], items) => (this.page === 0 ? items : [...acc, ...items]), [] as T[]),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  onSearch(value: string): void {
    this.search$.next(value);
  }

  onOpened(opened: boolean) {
    if (!opened) return;

    requestAnimationFrame(() => {
      const overlayRoot = this.overlayContainer.getContainerElement();
      const panel = overlayRoot.querySelector('.mat-mdc-select-panel');

      if (!panel) return;

      fromEvent(panel, 'scroll')
        .pipe(
          throttleTime(200),
          filter(() => {
            const threshold = 50;
            const isAtBottom =
              panel.scrollTop + panel.clientHeight >= panel.scrollHeight - threshold;

            const currentPage = this.page + 1;
            const canLoadMore =
              currentPage < this.maxPage && currentPage * this.pageSize < this.totalItems;

            return isAtBottom && !this.loading$.value && canLoadMore;
          }),
          takeUntil(this.matSelect._closedStream),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe(() => this.loadNextPage$.next());
    });
  }

  onSelectionChange(item: T): void {
    this.value = item;
    this.onChange(item);
    this.onTouched();
  }

  // ControlValueAccessor
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value: T | null): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
