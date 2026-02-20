import { Component, Input } from '@angular/core';
import { Offer } from '../../../../common/models/offer.model';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DatePipe, NgClass } from '@angular/common';
import { OverflowTooltip } from '../../../../shared/directives/overflow-tooltip';
import { DATE_FORMAT } from '../../../../common/constants/date-format.const';
import { OFFER_STATUS_CLASSES } from '../../../../common/constants/offer-status.consts';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-offer-item',
  imports: [
    MatCardModule,
    MatIconModule,
    NgClass,
    FlexLayoutModule,
    RouterLink,
    DatePipe,
    OverflowTooltip,
    MatFormFieldModule,
  ],
  templateUrl: './offer-item.html',
  styleUrl: './offer-item.scss',
})
export class OfferItem {
  @Input() offer: Offer;
  dateFormat = DATE_FORMAT.DEFAULT;
  statusClasses = OFFER_STATUS_CLASSES;
}
