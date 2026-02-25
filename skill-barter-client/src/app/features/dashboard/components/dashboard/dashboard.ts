import { Component, inject, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.state';
import { UserSkillActions } from '../../../user-skill/store/user-skill.actions';
import { OfferActions } from '../../../offer/store/offer.actions';
import { OfferStatus } from '../../../../common/enums/offer-status.enum';
import { initialStateOfferFilter } from '../../../offer/store/offer.reducer';
import { Observable } from 'rxjs';
import { selectOfferGlobal } from '../../../offer/store/offer.selectors';
import { AsyncPipe } from '@angular/common';

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
