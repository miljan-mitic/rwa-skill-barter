import { Component, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.state';
import { UserSkillActions } from '../../../user-skill/store/user-skill.actions';
import { OfferActions } from '../../../offer/store/offer.actions';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, FlexLayoutModule, RouterLink, RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private store = inject(Store<AppState>);

  restartSkillsFilter() {
    this.store.dispatch(UserSkillActions.restartUserSkillFilter());
  }

  restartOffersFilter() {
    this.store.dispatch(OfferActions.restartOfferFilter());
  }
}
