import { Component, Input } from '@angular/core';
import { UserSkill } from '../../../../common/models/user-skill.model';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DatePipe } from '@angular/common';
import { OverflowTooltip } from '../../../../shared/directives/overflow-tooltip';
import { DATE_FORMAT } from '../../../../common/constants/date-format.const';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-skill-item',
  imports: [MatCardModule, MatIconModule, RouterLink, FlexLayoutModule, DatePipe, OverflowTooltip],
  templateUrl: './user-skill-item.html',
  styleUrl: './user-skill-item.scss',
})
export class UserSkillItem {
  @Input({ required: true }) userSkill: UserSkill;

  dateFormat = DATE_FORMAT.DEFAULT;
}
