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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { OfferMeetingType } from '../../../../common/enums/offer-meeting-type.enum';
import { MatDividerModule } from '@angular/material/divider';
import { UserSkillService } from '../../../user-skill/services/user-skill.service';
import { UserSkillFilterDto } from '../../../user-skill/dtos/user-skill-filter.dto';
import { UserSkill } from '../../../../common/models/user-skill.model';
import { User } from '../../../../common/models/user.model';
import { selectCurrentUser } from '../../../user/state/user.selector';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ALLOWED_KEYS } from '../../../../common/constants/allowed-keys.consts';
import { OFFER_MEETING } from '../../../../common/constants/offer-meeting.consts';

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
    MatDatepickerModule,
    MatTimepickerModule,
    FormsModule,
    FlexLayoutModule,
    RemoteSearchableSelect,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './offer-create.html',
  styleUrl: './offer-create.scss',
})
export class OfferCreate implements OnInit {
  meetingType = OfferMeetingType;
  meetingDuration = OFFER_MEETING.DURATION;
  minDate = new Date();
  minTime = signal<Date | null>(null);
  meetingTime: string | null = null;
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

  onDateChange(date: Date | null) {
    this.meetingTime = null;

    if (!date) {
      return;
    }

    const now = new Date();
    const selectedDate = new Date(date);

    const isToday = selectedDate.toDateString() === now.toDateString();

    if (isToday) {
      const buffered = new Date(now.getTime() + OFFER_MEETING.AT.BUFFER_MS);

      const minutes = Math.ceil(buffered.getMinutes() / 15) * 15;
      buffered.setMinutes(minutes);
      buffered.setSeconds(0);
      buffered.setMilliseconds(0);

      this.minTime.set(buffered);
    } else {
      this.minTime.set(null);
    }
  }

  disableManualInput(event: KeyboardEvent) {
    if (!ALLOWED_KEYS.OFFER.MEETING.includes(event.key)) {
      event.preventDefault();
    }
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      const offerData = form.value;

      const date: Date = offerData.meetingDate;
      const time: Date = offerData.meetingTime;

      const meetingAt = new Date(date);
      meetingAt.setHours(time.getHours());
      meetingAt.setMinutes(time.getMinutes());

      const minAllowed = new Date(Date.now() + OFFER_MEETING.AT.BUFFER_MS);

      if (meetingAt < minAllowed) {
        window.location.reload();
        return;
      }

      const offerDto: OfferDto = {
        title: offerData.title,
        userSkillId: offerData.userSkill.id,
        meetingType: offerData.meetingType,
        meetingAt,
        durationMinutes: offerData.durationMeeting,
        ...(offerData.description && { description: offerData.description }),
      };

      this.store.dispatch(OfferActions.createOffer({ offerDto }));
    }
  }
}
