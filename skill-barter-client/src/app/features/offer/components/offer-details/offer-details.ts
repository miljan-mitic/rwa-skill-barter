import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { combineLatest, filter, Observable } from 'rxjs';
import { Offer } from '../../../../common/models/offer.model';
import { Store } from '@ngrx/store';
import { OfferState } from '../../store/offer.state';
import { selectOfferDetailed, selectOfferLoading } from '../../store/offer.selectors';
import { selectIdFromRouteParams } from '../../../../store/app.selector';
import { selectCurrentUser } from '../../../user/state/user.selector';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OfferActions } from '../../store/offer.actions';
import { Role } from '../../../../common/enums/role.enum';
import { ConfirmDialogActions } from '../../../../shared/confirm-dialog/store/confirm-dialog.actions';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Loader } from '../../../../shared/components/loader/loader';
import { DATE_FORMAT } from '../../../../common/constants/date-format.const';
import { OfferUpdateDto } from '../../dtos/offer-update.dto';
import { MatRadioModule } from '@angular/material/radio';
import { OfferMeetingType } from '../../../../common/enums/offer-meeting-type.enum';
import {
  OFFER_STATUS_CLASSES,
  OFFER_STATUS_BUTTON_CLASSES,
  OFFER_CHANGE_STATUS,
} from '../../../../common/constants/offer-status.consts';
import { OfferStatus } from '../../../../common/enums/offer-status.enum';

@Component({
  selector: 'app-offer-details',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    ReactiveFormsModule,
    NgClass,
    AsyncPipe,
    DatePipe,
    FlexLayoutModule,
    Loader,
  ],
  templateUrl: './offer-details.html',
  styleUrl: './offer-details.scss',
})
export class OfferDetails {
  dateFormat = DATE_FORMAT.DEFAULT;
  statusClasses = OFFER_STATUS_CLASSES;
  statusButtonClasses = OFFER_STATUS_BUTTON_CLASSES;
  meetingType = OfferMeetingType;
  offerStatus = OfferStatus;

  offerForm: FormGroup;

  isEditMode = signal<boolean>(false);
  isSaving = signal<boolean>(false);

  offer$: Observable<Offer | undefined>;
  loading$: Observable<boolean>;
  offer: Offer;

  private store = inject(Store<OfferState>);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.initForm();
    this.loadOffer();
    this.loading$ = this.store.select(selectOfferLoading);
  }

  private initForm() {
    this.offerForm = new FormGroup({
      description: new FormControl({ value: '', disabled: false }, [Validators.maxLength(100)]),
      title: new FormControl({ value: '', disabled: false }, [
        Validators.required,
        Validators.maxLength(30),
      ]),
      meetingType: new FormControl({ value: '', disabled: false }, [Validators.required]),
    });
  }

  private loadOffer() {
    combineLatest([
      this.store.select(selectIdFromRouteParams),
      this.store.select(selectCurrentUser),
    ])
      .pipe(
        filter(([id, user]) => !!id && !!user),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([offerId, user]) => {
        this.store.dispatch(
          OfferActions.loadOffer({
            id: +offerId!,
            ...(user?.role === Role.ADMIN && { isAdmin: true }),
          }),
        );
      });

    this.offer$ = this.store.select(selectOfferDetailed);

    this.offer$
      .pipe(
        filter((offer) => !!offer),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((offer) => {
        this.offer = offer;
        this.offerForm.patchValue({
          title: this.offer.title,
          description: this.offer.description,
          meetingType: this.offer.meetingType,
        });
        this.offerForm.markAsPristine();

        this.isEditMode.set(false);
        this.isSaving.set(false);
        this.offerForm?.enable({ emitEvent: false });
      });
  }

  toggleEditMode(): void {
    if (this.isEditMode()) {
      this.save();
    } else {
      this.isEditMode.set(true);
    }
  }

  updateStatus() {
    this.store.dispatch(
      OfferActions.updateOffer({
        id: this.offer.id,
        offerUpdateDto: {
          status: OFFER_CHANGE_STATUS[this.offer.status],
        },
      }),
    );
  }

  save() {
    if (this.offerForm?.invalid) {
      this.offerForm.markAsTouched();
      return;
    }

    const changedValues: Partial<OfferUpdateDto> = {};

    Object.keys(this.offerForm.controls).forEach((key) => {
      const control = this.offerForm.get(key);
      if (control && control.dirty) {
        changedValues[key as keyof OfferUpdateDto] = control.value === '' ? null : control.value;
      }
    });

    if (!Object.keys(changedValues).length) {
      this.isEditMode.set(false);
      return;
    }

    this.isSaving.set(true);
    this.offerForm?.disable({ emitEvent: false });

    this.store.dispatch(
      OfferActions.updateOffer({
        id: this.offer.id,
        offerUpdateDto: changedValues,
      }),
    );
  }

  deleteOffer(): void {
    this.store.dispatch(
      ConfirmDialogActions.openConfirmDialog({
        title: 'Delete Offer',
        message: 'Are you sure you want to delete this offer?',
        confirmAction: OfferActions.deleteOffer({ id: this.offer.id }),
      }),
    );
  }
}
