import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { SkillFilters } from '../skill-filters/skill-filters';
import { SkillList } from '../skill-list/skill-list';

@Component({
  selector: 'app-skill-dashboard',
  imports: [MatCardModule, FlexLayoutModule, SkillFilters, SkillList],
  templateUrl: './skill-dashboard.html',
  styleUrl: './skill-dashboard.scss',
})
export class SkillDashboard {}
