import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BarterFilters } from '../barter-filter/barter-filters';
import { BarterList } from '../barter-list/barter-list';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-barter-dashboard',
  imports: [MatCardModule, FlexLayoutModule, BarterFilters, BarterList],
  templateUrl: './barter-dashboard.html',
  styleUrl: './barter-dashboard.scss',
})
export class BarterDashboard {}
