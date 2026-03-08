import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { UserFilters } from '../user-filters/user-filters';
import { UserList } from '../user-list/user-list';

@Component({
  selector: 'app-user-dashboard',
  imports: [MatCardModule, FlexLayoutModule, UserFilters, UserList],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.scss',
})
export class UserDashboard {}
