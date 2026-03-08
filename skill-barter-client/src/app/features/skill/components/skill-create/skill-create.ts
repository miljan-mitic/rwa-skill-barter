import { Component, inject, signal } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { SkillState } from '../../store/skill.state';
import { SkillDto } from '../../dtos/skill.dto';
import { SkillActions } from '../../store/skill.actions';
import { Category } from '../../../../common/models/category.model';
import { FilterParams } from '../../../../common/types/filter-params.type';
import { CategoryFilterDto } from '../../../category/dtos/category-filter.dto';
import { Observable } from 'rxjs';
import { PageResponse } from '../../../../common/interfaces/page-result.interface';
import { CategoryService } from '../../../category/services/category.service';
import { RemoteSearchableSelect } from '../../../../shared/components/remote-searchable-select/remote-searchable-select';

@Component({
  selector: 'app-skill-create',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    FormsModule,
    RemoteSearchableSelect,
  ],
  templateUrl: './skill-create.html',
  styleUrl: './skill-create.scss',
})
export class SkillCreate {
  category = signal<Category | null>(null);

  private store = inject(Store<SkillState>);
  private categoryService = inject(CategoryService);

  categoryLabel = (item: Category) => item.name;
  trackCategory = (item: Category) => item.id;
  fetchCategoryFn = (
    params: FilterParams<Category, CategoryFilterDto>,
  ): Observable<PageResponse<Category>> => {
    return this.categoryService.get(params);
  };

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    const skillData = form.value;
    const { category, name, description } = skillData;

    const skillDto: SkillDto = {
      categoryId: category.id,
      name: name,
      ...(description && { description: description }),
    };

    this.store.dispatch(SkillActions.createSkill({ skillDto }));
  }
}
