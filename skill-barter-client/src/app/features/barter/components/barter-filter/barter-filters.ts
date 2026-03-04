import { Component, inject, ViewChild } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { BarterUserRole } from '../../../../common/enums/barter-user-role.enum';
import { BarterFilter, BarterState } from '../../store/barter.state';
import { BarterActions } from '../../store/barter.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-barter-filters',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
  ],
  templateUrl: './barter-filters.html',
  styleUrl: './barter-filters.scss',
})
export class BarterFilters {
  barterUserRole = BarterUserRole;
  @ViewChild('barterUserRoleSelect') barterUserRoleSelect: MatSelect;

  private store = inject(Store<BarterState>);

  clearFilters() {
    this.restartFilterValues();
    this.changeFilter({ barterUserRole: undefined });
  }

  changeBarterUserRole(barterUserRole: BarterUserRole) {
    this.changeFilter({ barterUserRole });
  }

  private restartFilterValues() {
    if (this.barterUserRoleSelect?.value) {
      this.barterUserRoleSelect.value = undefined;
    }
  }

  private changeFilter(filter: BarterFilter) {
    this.store.dispatch(BarterActions.changeBarterFilter({ filter }));
  }
}
