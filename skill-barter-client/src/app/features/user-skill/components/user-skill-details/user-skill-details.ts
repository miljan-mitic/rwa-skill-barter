import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { combineLatest, filter, Observable, switchMap } from 'rxjs';
import { UserSkillState } from '../../store/user-skill.state';
import { Store } from '@ngrx/store';
import { selectIdFromRouteParams } from '../../../../store/app.selector';
import { selectCurrentUser } from '../../../user/state/user.selector';
import { UserSkillActions } from '../../store/user-skill.actions';
import { Role } from '../../../../common/enums/role.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserSkill } from '../../../../common/models/user-skill.model';
import { selectDetailedUserSkill } from '../../store/user-skill.selector';
import { MatCardModule } from '@angular/material/card';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-skill-details',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    AsyncPipe,
    DatePipe,
    FlexLayoutModule,
  ],
  templateUrl: './user-skill-details.html',
  styleUrl: './user-skill-details.scss',
})
export class UserSkillDetails implements OnInit {
  userSkill$: Observable<UserSkill | undefined>;

  private store = inject(Store<UserSkillState>);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    combineLatest([
      this.store.select(selectIdFromRouteParams),
      this.store.select(selectCurrentUser),
    ])
      .pipe(
        filter(([id, user]) => !!id && !!user),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([userSkillId, user]) => {
        this.store.dispatch(
          UserSkillActions.loadUserSkill({
            id: +userSkillId!,
            ...(user?.role === Role.ADMIN && { isAdmin: true }),
          }),
        );
      });

    this.userSkill$ = this.store.select(selectDetailedUserSkill);
  }

  deleteUserSkill(userSkillId: number): void {
    if (confirm('Are you sure you want to delete this skill?')) {
      // this.store.dispatch(UserSkillActions.deleteUserSkill({ id: userSkillId }));
    }
  }
}
