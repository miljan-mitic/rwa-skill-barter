import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, fromEvent, map, startWith } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PageVisibilityService {
  private destroyRef = inject(DestroyRef);

  visibility$ = fromEvent(document, 'visibilitychange').pipe(
    startWith(null),
    map(() => document.visibilityState === 'visible'),
    distinctUntilChanged(),
    takeUntilDestroyed(this.destroyRef),
  );
}
