import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NotificationService } from '../../../shared/services/notification.service';
import { catchError, EMPTY, exhaustMap, map, mergeMap, of, switchMap, tap } from 'rxjs';
import {
  NotificationSeverity,
  NotificationSummary,
} from '../../../common/enums/notification.enums';
import { HttpStatusCode } from '@angular/common/http';
import { AuthActions } from '../../auth/store/auth.actions';
import { SkillService } from '../services/skill.service';
import { SkillActions } from './skill.actions';

@Injectable()
export class SkillEffects {
  private readonly actions$ = inject(Actions);
  private readonly router = inject(Router);
  private readonly skillService = inject(SkillService);
  private readonly notificationService = inject(NotificationService);

  createSkill$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SkillActions.createSkill),
      exhaustMap(({ skillDto }) =>
        this.skillService.create(skillDto).pipe(
          map((skill) => SkillActions.createSkillSuccess({ skill })),
          catchError((error) => of(SkillActions.createSkillFailure(error))),
        ),
      ),
    ),
  );

  createSkillSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SkillActions.createSkillSuccess),
        tap(() => {
          this.router.navigate(['/admin/skills']);
          this.notificationService.showMessage(
            NotificationSeverity.SUCCESS,
            NotificationSummary.SUCCESS,
            'Skill added successfully',
          );
        }),
      ),
    { dispatch: false },
  );

  loadSkills$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SkillActions.loadSkills),
      switchMap(({ skillFilterDto }) =>
        this.skillService.get(skillFilterDto).pipe(
          map(({ items, totalItems }) =>
            SkillActions.loadSkillsSuccess({ skills: items, length: totalItems }),
          ),
          catchError((error) => of(SkillActions.loadSkillsFailure(error))),
        ),
      ),
    ),
  );

  deleteSkill$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SkillActions.deleteSkill),
      mergeMap(({ id }) =>
        this.skillService.delete(id).pipe(
          map(() => SkillActions.deleteSkillSuccess()),
          catchError((error) => of(SkillActions.deleteSkillFailure(error))),
        ),
      ),
    ),
  );

  deleteSkillSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SkillActions.deleteSkillSuccess),
      tap(() => {
        this.notificationService.showMessage(
          NotificationSeverity.SUCCESS,
          NotificationSummary.SUCCESS,
          'Skill deleted successfully',
        );
      }),
      map(() => SkillActions.changeSkillFilter({ filter: {} })),
    ),
  );

  skillFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        SkillActions.createSkillFailure,
        SkillActions.loadSkillsFailure,
        SkillActions.deleteSkillFailure,
      ),
      mergeMap(({ error }) => {
        console.error('Skill Error:', error);
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
