import { Component, inject, Input } from '@angular/core';
import { Category } from '../../../../common/models/category.model';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { OverflowTooltip } from '../../../../shared/directives/overflow-tooltip';
import { DatePipe } from '@angular/common';
import { DATE_FORMAT } from '../../../../common/constants/date-format.const';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Store } from '@ngrx/store';
import { CategoryState } from '../../store/category.state';
import { ConfirmDialogActions } from '../../../../shared/confirm-dialog/store/confirm-dialog.actions';
import { CategoryActions } from '../../store/category.actions';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-category-item',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    FlexLayoutModule,
    OverflowTooltip,
    DatePipe,
  ],
  templateUrl: './category-item.html',
  styleUrl: './category-item.scss',
})
export class CategoryItem {
  @Input({ required: true }) category: Category;

  dateFormat = DATE_FORMAT.DEFAULT;

  private store = inject(Store<CategoryState>);

  onDelete() {
    this.store.dispatch(
      ConfirmDialogActions.openConfirmDialog({
        title: 'Delete category',
        message: 'Are you sure you want to delete this category?',
        confirmAction: CategoryActions.deleteCategory({ id: this.category.id }),
      }),
    );
  }
}
