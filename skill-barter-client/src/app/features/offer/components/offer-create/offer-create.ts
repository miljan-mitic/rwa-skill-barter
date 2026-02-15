import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RemoteSearchableSelect } from '../../../../shared/components/remote-select/remote-searchable-select';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FilterParams } from '../../../../common/types/filter-params.type';
import { filter, Observable } from 'rxjs';
import { PageResponse } from '../../../../common/interfaces/page-result.interface';
import { OfferState } from '../../store/offer.state';
import { Store } from '@ngrx/store';
import { OfferActions } from '../../store/offer.actions';
import { OfferDto } from '../../dtos/offer.dto';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { OfferMeetingType } from '../../../../common/enums/offer-meeting-type.enum';
import { MatDividerModule } from '@angular/material/divider';
import { UserSkillService } from '../../../user-skill/services/user-skill.service';
import { UserSkillFilterDto } from '../../../user-skill/dtos/user-skill-filter.dto';
import { UserSkill } from '../../../../common/models/user-skill.model';
import { User } from '../../../../common/models/user.model';
import { selectCurrentUser } from '../../../user/state/user.selector';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-offer-create',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatRadioModule,
    MatDividerModule,
    FormsModule,
    FlexLayoutModule,
    RemoteSearchableSelect,
  ],
  templateUrl: './offer-create.html',
  styleUrl: './offer-create.scss',
})
export class OfferCreate implements OnInit {
  meetingType = OfferMeetingType;
  user = signal<User | null>(null);

  userSkillExtraFilters = computed(
    (): Partial<UserSkillFilterDto> => ({
      userId: this.user()?.id,
    }),
  );

  private destroyRef = inject(DestroyRef);
  private store = inject(Store<OfferState>);
  private userSkillService = inject(UserSkillService);

  userSkillLabel = (item: UserSkill) => item.skill!.name;
  trackUserSkill = (item: UserSkill) => item.id;
  fetchUserSkillFn = (
    params: FilterParams<UserSkillFilterDto>,
  ): Observable<PageResponse<UserSkill>> => {
    return this.userSkillService.get(params);
  };

  ngOnInit(): void {
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

  onSubmit(form: NgForm): void {
    if (form.valid) {
      const offerData = form.value;

      const offerDto: OfferDto = {
        title: offerData.title,
        userSkillId: offerData.userSkill.id,
        meetingType: offerData.meetingType,
        ...(offerData.description && { description: offerData.description }),
      };

      this.store.dispatch(OfferActions.createOffer({ offerDto }));
    }
  }
}
