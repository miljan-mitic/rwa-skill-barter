import { Component, inject, Input, OnInit } from '@angular/core';
import { OfferRequest } from '../../../../common/models/offer-request.model';
import { DATE_FORMAT } from '../../../../common/constants/date-format.const';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, NgClass } from '@angular/common';
import { OverflowTooltip } from '../../../../shared/directives/overflow-tooltip';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  OFFER_REQUEST_STATUS_CLASSES,
  OFFER_REQUEST_STATUS_ICON,
} from '../../../../common/constants/offer-request-status.consts';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CreatedAgoPipe } from '../../../../shared/pipes/created-ago.pipe';
import { OfferRequestStatus } from '../../../../common/enums/offer-request-status.enum';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { OfferRequestState } from '../../store/offer-request.state';
import { selectAcceptedRequest } from '../../../offer/store/offer.selectors';
import { OfferRequestActions } from '../../store/offer-request.actions';

@Component({
  selector: 'app-offer-request-item',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    OverflowTooltip,
    NgClass,
    AsyncPipe,
    MatFormFieldModule,
    CreatedAgoPipe,
  ],
  templateUrl: './offer-request-item.html',
  styleUrl: './offer-request-item.scss',
})
export class OfferRequestItem implements OnInit {
  @Input({ required: true }) offerRequest: OfferRequest;
  statusEnum = OfferRequestStatus;
  statusClasses = OFFER_REQUEST_STATUS_CLASSES;
  statusIcon = OFFER_REQUEST_STATUS_ICON;
  dateFormat = DATE_FORMAT.DEFAULT;

  hasAccepted$: Observable<boolean | undefined>;

  private store = inject(Store<OfferRequestState>);

  ngOnInit(): void {
    this.hasAccepted$ = this.store.select(selectAcceptedRequest);
  }

  onChangeStatus(status: OfferRequestStatus) {
    this.store.dispatch(
      OfferRequestActions.changeOfferRequestStatus({ id: this.offerRequest.id, status }),
    );
  }
}
