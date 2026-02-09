import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, EMPTY, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { UserSkillService } from '../services/user-skill.service';
import { UserSkillActions } from './user-skill.actions';
import { Router } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification.service';
import {
  NotificationSeverity,
  NotificationSummary,
} from '../../../common/enums/notification.enums';
import { HttpStatusCode } from '@angular/common/http';
import { AuthActions } from '../../auth/store/auth.actions';

@Injectable()
export class UserSkillEffects {
  private readonly actions$ = inject(Actions);
  private readonly router = inject(Router);
  private readonly userSkillService = inject(UserSkillService);
  private readonly notificationService = inject(NotificationService);

  createUserSkill$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserSkillActions.createUserSkill),
      switchMap(({ userSkillDto }) => {
        return this.userSkillService.create(userSkillDto).pipe(
          concatMap((userSkill) => {
            return [UserSkillActions.createUserSkillSuccess({ userSkill })];
          }),
          catchError((error) => of(UserSkillActions.createUserSkillFailure(error))),
        );
      }),
    ),
  );

  createUserSkillSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserSkillActions.createUserSkillSuccess),
        tap(({ userSkill }) => {
          this.router.navigate(['/dashboard/skills', userSkill.id]);
          this.notificationService.showMessage(
            NotificationSeverity.SUCCESS,
            NotificationSummary.SUCCESS,
            'Skill added successfully',
          );
        }),
      ),
    { dispatch: false },
  );

  loadUserSkills$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserSkillActions.loadUserSkills),
      switchMap(({ userSkillFilterDto, isAdmin }) => {
        return this.userSkillService.get(userSkillFilterDto, isAdmin).pipe(
          tap((response) => console.log('User Skills Loading...', response)),
          map(({ items, totalItems }) =>
            UserSkillActions.loadUserSkillsSuccess({ userSkills: items, length: totalItems }),
          ),
          catchError((error) => of(UserSkillActions.loadUserSkillsFailure(error))),
        );
      }),
    ),
  );

  loadUserSkill$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserSkillActions.loadUserSkill),
      switchMap(({ id, isAdmin }) =>
        this.userSkillService.getById(id, isAdmin).pipe(
          map((userSkill) => UserSkillActions.loadUserSkillSuccess({ userSkill })),
          catchError((error) => of(UserSkillActions.loadUserSkillFailure(error))),
        ),
      ),
    ),
  );

  updateUserSkill$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserSkillActions.updateUserSkill),
      switchMap(({ id, userSkillUpdateDto }) =>
        this.userSkillService.update(id, userSkillUpdateDto).pipe(
          map((userSkill) => UserSkillActions.updateUserSkillSuccess({ userSkill })),
          catchError((error) => of(UserSkillActions.updateUserSkillFailure(error))),
        ),
      ),
    ),
  );

  deleteUserSkill$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserSkillActions.deleteUserSkill),
      switchMap(({ id }) =>
        this.userSkillService.delete(id).pipe(
          map(() => UserSkillActions.deleteUserSkillSuccess()),
          catchError((error) => of(UserSkillActions.deleteUserSkillFailure(error))),
        ),
      ),
    ),
  );

  deleteUserSkillSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserSkillActions.deleteUserSkillSuccess),
        tap(() => {
          this.router.navigate(['/dashboard/skills']);
          this.notificationService.showMessage(
            NotificationSeverity.SUCCESS,
            NotificationSummary.SUCCESS,
            'Skill deleted successfully',
          );
        }),
      ),
    { dispatch: false },
  );

  userSkillFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        UserSkillActions.createUserSkillFailure,
        UserSkillActions.loadUserSkillsFailure,
        UserSkillActions.loadUserSkillFailure,
        UserSkillActions.updateUserSkillFailure,
        UserSkillActions.deleteUserSkillFailure,
      ),
      mergeMap(({ error }) => {
        console.error('User Skill Error:', error);
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
