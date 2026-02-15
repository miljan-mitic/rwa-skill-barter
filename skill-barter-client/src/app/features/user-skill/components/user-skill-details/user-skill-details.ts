import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { combineLatest, filter, Observable } from 'rxjs';
import { UserSkillState } from '../../store/user-skill.state';
import { Store } from '@ngrx/store';
import { selectIdFromRouteParams } from '../../../../store/app.selector';
import { selectCurrentUser } from '../../../user/state/user.selector';
import { UserSkillActions } from '../../store/user-skill.actions';
import { Role } from '../../../../common/enums/role.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserSkill } from '../../../../common/models/user-skill.model';
import { selectUserSkillDetailed, selectUserSkillLoading } from '../../store/user-skill.selector';
import { MatCardModule } from '@angular/material/card';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmDialogActions } from '../../../../shared/confirm-dialog/store/confirm-dialog.actions';
import { Loader } from '../../../../shared/components/loader/loader';
import { DATE_FORMAT } from '../../../../common/constants/date-format.const';

@Component({
  selector: 'app-user-skill-details',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    AsyncPipe,
    DatePipe,
    FlexLayoutModule,
    Loader,
  ],
  templateUrl: './user-skill-details.html',
  styleUrl: './user-skill-details.scss',
})
export class UserSkillDetails implements OnInit {
  dateFormat = DATE_FORMAT.DEFAULT;

  userSkillForm: FormGroup;

  isEditMode = signal<boolean>(false);
  isSaving = signal<boolean>(false);

  userSkill$: Observable<UserSkill | undefined>;
  loading$: Observable<boolean>;
  userSkill: UserSkill;

  private store = inject(Store<UserSkillState>);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.initForm();
    this.loadUserSkill();
    this.loading$ = this.store.select(selectUserSkillLoading);
  }

  private initForm() {
    this.userSkillForm = new FormGroup({
      description: new FormControl({ value: '', disabled: false }, [Validators.maxLength(100)]),
    });
  }

  private loadUserSkill() {
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

    this.userSkill$ = this.store.select(selectUserSkillDetailed);

    this.userSkill$
      .pipe(
        filter((userSkill) => !!userSkill),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((userSkill) => {
        this.userSkill = userSkill;
        this.isEditMode.set(false);
        this.isSaving.set(false);
        this.userSkillForm.get('description')?.enable({ emitEvent: false });
      });
  }

  toggleEditMode(): void {
    if (this.isEditMode()) {
      this.save();
    } else {
      this.userSkillForm.get('description')?.setValue(this.userSkill.description || '');
      this.isEditMode.set(true);
    }
  }

  save() {
    const descriptionControl = this.userSkillForm.get('description');
    if (descriptionControl?.invalid) {
      descriptionControl.markAsTouched();
      return;
    }

    const original = this.userSkill.description?.trim() || '';
    const edited = descriptionControl?.value?.trim() || '';

    if (original === edited) {
      this.isEditMode.set(false);
      return;
    }

    this.isSaving.set(true);
    descriptionControl?.disable({ emitEvent: false });

    this.store.dispatch(
      UserSkillActions.updateUserSkill({
        id: this.userSkill.id,
        userSkillUpdateDto: { description: edited },
      }),
    );
  }

  deleteUserSkill(): void {
    this.store.dispatch(
      ConfirmDialogActions.openConfirmDialog({
        title: 'Delete Skill',
        message: 'Are you sure you want to delete this skill?',
        confirmAction: UserSkillActions.deleteUserSkill({ id: this.userSkill.id }),
      }),
    );
  }
}
