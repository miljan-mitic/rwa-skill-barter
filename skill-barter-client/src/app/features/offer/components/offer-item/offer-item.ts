import { Component, Input } from '@angular/core';
import { Offer } from '../../../../common/models/offer.model';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-offer-item',
  imports: [RouterLink, MatCardModule, MatChipsModule, FlexLayoutModule],
  templateUrl: './offer-item.html',
  styleUrl: './offer-item.scss',
})
export class OfferItem {
  @Input() offer: Offer;
}
