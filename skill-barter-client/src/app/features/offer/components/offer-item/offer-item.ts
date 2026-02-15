import { Component, Input } from '@angular/core';
import { Offer } from '../../../../common/models/offer.model';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DatePipe } from '@angular/common';
import { OverflowTooltip } from '../../../../shared/directives/overflow-tooltip';
import { DATE_FORMAT } from '../../../../common/constants/date-format.const';

@Component({
  selector: 'app-offer-item',
  imports: [
    MatCardModule,
    FlexLayoutModule,
    RouterLink,
    FlexLayoutModule,
    DatePipe,
    OverflowTooltip,
  ],
  templateUrl: './offer-item.html',
  styleUrl: './offer-item.scss',
})
export class OfferItem {
  @Input() offer: Offer;
  dateFormat = DATE_FORMAT.DEFAULT;
}
