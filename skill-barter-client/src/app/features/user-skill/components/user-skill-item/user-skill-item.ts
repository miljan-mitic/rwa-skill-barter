import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { UserSkill } from '../../../../common/models/user-skill.model';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-skill-item',
  imports: [
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
    RouterLink,
    FlexLayoutModule,
    DatePipe,
  ],
  templateUrl: './user-skill-item.html',
  styleUrl: './user-skill-item.scss',
})
export class UserSkillItem implements AfterViewInit, OnDestroy {
  @Input({ required: true }) userSkill: UserSkill;
  @ViewChild('descriptionEl') descriptionEl: ElementRef<HTMLElement>;

  showTooltip = false;
  private resizeObserver: ResizeObserver;

  private cdr = inject(ChangeDetectorRef);

  ngAfterViewInit(): void {
    const el = this.descriptionEl?.nativeElement;
    if (!el) {
      return;
    }

    this.showTooltip = el.scrollWidth > el.clientWidth;

    this.cdr.detectChanges();

    this.resizeObserver = new ResizeObserver(() => {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      if (this.showTooltip !== hasOverflow) {
        this.showTooltip = hasOverflow;
        this.cdr.detectChanges();
      }
    });

    this.resizeObserver.observe(el);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }
}
