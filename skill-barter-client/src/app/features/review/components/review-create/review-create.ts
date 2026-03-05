import { Component, inject, model } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReviewDto } from '../../dtos/review.dto';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.state';
import { ReviewActions } from '../../store/review.actions';
import { Rating } from '../../../../shared/components/rating/rating';

@Component({
  selector: 'app-review-create',
  imports: [
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconButton,
    FormsModule,
    FlexLayoutModule,
    Rating,
  ],
  templateUrl: './review-create.html',
  styleUrl: './review-create.scss',
})
export class ReviewCreate {
  private dialogRef = inject(MatDialogRef<ReviewCreate>);
  private data = inject<{ barterId: number }>(MAT_DIALOG_DATA);
  barterId = model(this.data.barterId);

  private store = inject(Store<AppState>);

  close() {
    this.dialogRef.close();
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const { rating, comment } = form.value;

      const reviewDto: ReviewDto = {
        barterId: this.barterId(),
        rating,
        ...(comment && { comment }),
      };

      this.store.dispatch(ReviewActions.createReview({ reviewDto }));

      this.dialogRef.close();
    }
  }
}
