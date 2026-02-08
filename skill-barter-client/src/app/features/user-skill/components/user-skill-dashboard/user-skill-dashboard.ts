import { Component } from '@angular/core';
import { UserSkillList } from '../user-skill-list/user-skill-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-skill-dashboard',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    RouterLink,
    UserSkillList,
  ],
  templateUrl: './user-skill-dashboard.html',
  styleUrl: './user-skill-dashboard.scss',
})
export class UserSkillDashboard {}
