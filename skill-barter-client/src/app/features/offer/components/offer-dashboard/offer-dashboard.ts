import { Component, inject, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { OfferList } from '../offer-list/offer-list';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { OfferState } from '../../store/offer.state';
import { selectOfferGlobal } from '../../store/offer.selectors';
import { OfferFilters } from '../offer-filter/offer-filters';

@Component({
  selector: 'app-offer-dashboard',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    OfferList,
    OfferFilters,
  ],
  templateUrl: './offer-dashboard.html',
  styleUrl: './offer-dashboard.scss',
})
export class OfferDashboard implements OnInit {
  global$: Observable<boolean | undefined>;

  private store = inject(Store<OfferState>);

  ngOnInit(): void {
    this.global$ = this.store.select(selectOfferGlobal);
  }
}
