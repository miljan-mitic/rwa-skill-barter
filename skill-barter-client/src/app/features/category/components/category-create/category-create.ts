import { Component, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CategoryDto } from '../../dtos/category.dto';
import { Store } from '@ngrx/store';
import { CategoryState } from '../../store/category.state';
import { CategoryActions } from '../../store/category.actions';

@Component({
  selector: 'app-category-create',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    FormsModule,
  ],
  templateUrl: './category-create.html',
  styleUrl: './category-create.scss',
})
export class CategoryCreate {
  private store = inject(Store<CategoryState>);

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    const categoryData = form.value;

    const categoryDto: CategoryDto = {
      name: categoryData.name,
      ...(categoryData.description && { description: categoryData.description }),
    };

    this.store.dispatch(CategoryActions.createCategory({ categoryDto }));
  }
}
