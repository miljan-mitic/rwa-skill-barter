import { Component, inject, Input } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OverflowTooltip } from '../../../../shared/directives/overflow-tooltip';
import { DatePipe } from '@angular/common';
import { Skill } from '../../../../common/models/skill.model';
import { DATE_FORMAT } from '../../../../common/constants/date-format.const';
import { Store } from '@ngrx/store';
import { SkillState } from '../../store/skill.state';
import { ConfirmDialogActions } from '../../../../shared/confirm-dialog/store/confirm-dialog.actions';
import { SkillActions } from '../../store/skill.actions';

@Component({
  selector: 'app-skill-item',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    FlexLayoutModule,
    OverflowTooltip,
    DatePipe,
  ],
  templateUrl: './skill-item.html',
  styleUrl: './skill-item.scss',
})
export class SkillItem {
  @Input({ required: true }) skill: Skill;

  dateFormat = DATE_FORMAT.DEFAULT;

  private store = inject(Store<SkillState>);

  onDelete() {
    this.store.dispatch(
      ConfirmDialogActions.openConfirmDialog({
        title: 'Delete skill',
        message: 'Are you sure you want to delete this skill?',
        confirmAction: SkillActions.deleteSkill({ id: this.skill.id }),
      }),
    );
  }
}
