import { Component, Input } from '@angular/core';
import { Skill } from '../../../../common/models/skill.model';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-skill-item',
  imports: [RouterLink, MatCardModule, MatChipsModule, FlexLayoutModule],
  templateUrl: './skill-item.html',
  styleUrl: './skill-item.scss',
})
export class SkillItem {
  @Input() skill: Skill;
}
