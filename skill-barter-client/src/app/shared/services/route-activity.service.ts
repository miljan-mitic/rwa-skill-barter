import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter, map, startWith } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RouteActivityService {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  isBartersRoute$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    startWith(null),
    map(() => this.router.url.startsWith('/dashboard/barters')),
    distinctUntilChanged(),
    takeUntilDestroyed(this.destroyRef),
  );
}
