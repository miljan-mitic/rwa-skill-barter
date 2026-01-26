import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SkillService } from '../services/skill.service';
import { SkillActions } from './skill.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';

@Injectable()
export class SkillEffects {
  private readonly actions$ = inject(Actions);
  private readonly skillService = inject(SkillService);

  loadSkills$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SkillActions.loadSkills),
      switchMap(({ skillFilterDto, isAdmin }) => {
        return this.skillService.get(skillFilterDto, isAdmin).pipe(
          tap((response) => console.log('Skills Loading...', response)),
          map(({ items, totalPages, totalItems, currentPage }) =>
            SkillActions.loadSkillsSuccess({ skills: items, length: totalItems }),
          ),
          catchError((error) => of(SkillActions.loadSkillsFailure({ error }))),
        );
      }),
    ),
  );
}
