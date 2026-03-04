import { Component, inject, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.state';
import { OfferStatus } from '../../../../common/enums/offer-status.enum';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { selectOfferGlobal } from '../../../../features/offer/store/offer.selectors';
import { UserSkillActions } from '../../../../features/user-skill/store/user-skill.actions';
import { BarterActions } from '../../../../features/barter/store/barter.actions';
import { OfferActions } from '../../../../features/offer/store/offer.actions';
import { initialStateOfferFilter } from '../../../../features/offer/store/offer.reducer';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, FlexLayoutModule, AsyncPipe, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  globalOffer$: Observable<boolean | undefined>;

  private store = inject(Store<AppState>);

  ngOnInit(): void {
    this.globalOffer$ = this.store.select(selectOfferGlobal);
  }

  restartSkillsFilter() {
    this.store.dispatch(UserSkillActions.restartUserSkillFilter());
  }

  restartBartersFilter() {
    this.store.dispatch(BarterActions.restartBarterFilter());
  }

  restartOffersFilter(global: boolean) {
    this.store.dispatch(
      OfferActions.changeOfferFilter({
        filter: {
          ...initialStateOfferFilter,
          global,
          ...(global
            ? {
                userOffers: false,
                status: OfferStatus.ACTIVE,
              }
            : {
                userOffers: true,
                status: undefined,
              }),
        },
      }),
    );
  }
}
