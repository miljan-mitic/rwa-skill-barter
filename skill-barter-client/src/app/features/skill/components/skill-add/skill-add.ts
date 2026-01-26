import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-skill-add',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    FlexLayoutModule,
    CommonModule,
    MatListModule,
  ],
  templateUrl: './skill-add.html',
  styleUrl: './skill-add.scss',
})
export class SkillAdd {
  onSubmit(form: NgForm): void {
    if (form.valid) {
      const skillData = form.value;
      console.log(skillData);
    }
  }
}
