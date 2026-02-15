import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { OfferList } from '../offer-list/offer-list';

@Component({
  selector: 'app-offer-dashboard',
  imports: [MatCardModule, MatIconModule, MatButtonModule, FlexLayoutModule, RouterLink, OfferList],
  templateUrl: './offer-dashboard.html',
  styleUrl: './offer-dashboard.scss',
})
export class OfferDashboard {}
