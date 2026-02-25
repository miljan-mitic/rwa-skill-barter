import { Component, computed, DestroyRef, inject, model, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RemoteSearchableSelect } from '../../../../shared/components/remote-select/remote-searchable-select';
import { UserSkillFilterDto } from '../../../user-skill/dtos/user-skill-filter.dto';
import { User } from '../../../../common/models/user.model';
import { Store } from '@ngrx/store';
import { UserSkillService } from '../../../user-skill/services/user-skill.service';
import { UserSkill } from '../../../../common/models/user-skill.model';
import { FilterParams } from '../../../../common/types/filter-params.type';
import { filter, Observable } from 'rxjs';
import { PageResponse } from '../../../../common/interfaces/page-result.interface';
import { selectCurrentUser } from '../../../user/state/user.selector';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OfferRequestActions } from '../../store/offer-request.actions';
import { OfferRequestDto } from '../../dtos/offer-request.dto';
import { OfferRequestState } from '../../store/offer-request.state';

@Component({
  selector: 'app-offer-request-create',
  imports: [
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconButton,
    FormsModule,
    FlexLayoutModule,
    RemoteSearchableSelect,
  ],
  templateUrl: './offer-request-create.html',
  styleUrl: './offer-request-create.scss',
})
export class OfferRequestCreate {
  user = signal<User | null>(null);
  createLabel = computed((): string =>
    this.hasCurrentUserRequest() ? 'Resend request' : 'Send request',
  );

  userSkillExtraFilters = computed(
    (): Partial<UserSkillFilterDto> => ({
      userId: this.user()?.id,
    }),
  );

  private dialogRef = inject(MatDialogRef<OfferRequestCreate>);
  private data = inject<{ offerId: number; hasCurrentUserRequest: boolean }>(MAT_DIALOG_DATA);
  offerId = model(this.data.offerId);
  hasCurrentUserRequest = model(this.data.hasCurrentUserRequest);

  private destroyRef = inject(DestroyRef);
  private store = inject(Store<OfferRequestState>);
  private userSkillService = inject(UserSkillService);

  userSkillLabel = (item: UserSkill) => item.skill!.name;
  trackUserSkill = (item: UserSkill) => item.id;
  fetchUserSkillFn = (
    params: FilterParams<UserSkillFilterDto>,
  ): Observable<PageResponse<UserSkill>> => {
    return this.userSkillService.get(params);
  };

  ngOnInit(): void {
    this.loadUser();
  }

  private loadUser() {
    this.store
      .select(selectCurrentUser)
      .pipe(
        filter((user) => !!user),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((user) => {
        this.user.set(user);
      });
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const offerRequestData = form.value;

      const offerRequestDto: OfferRequestDto = {
        offerId: this.offerId(),
        userSkillId: offerRequestData.userSkill.id,
        ...(offerRequestData.message && { message: offerRequestData.message }),
      };

      this.store.dispatch(OfferRequestActions.createOfferRequest({ offerRequestDto }));

      this.dialogRef.close();
    }
  }
}
