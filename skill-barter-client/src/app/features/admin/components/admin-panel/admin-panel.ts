import { Component, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.state';
import { CategoryActions } from '../../../category/store/category.actions';
import { SkillActions } from '../../../skill/store/skill.actions';
import { UserActions } from '../../../user/state/user.actions';

@Component({
  selector: 'app-admin-panel',
  imports: [MatCardModule, FlexLayoutModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.scss',
})
export class AdminPanel {
  private store = inject(Store<AppState>);

  restartCategoriesFilter() {
    this.store.dispatch(CategoryActions.restartCategoryFilter());
  }

  restartSkillsFilter() {
    this.store.dispatch(SkillActions.restartSkillFilter());
  }

  restartUsersFilter() {
    this.store.dispatch(UserActions.restartUserFilter());
  }
}
