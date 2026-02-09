import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { RemoteSearchableSelect } from '../../../../shared/components/remote-select/remote-searchable-select';
import { Category } from '../../../../common/models/category.model';
import { Skill } from '../../../../common/models/skill.model';
import { SkillFilterDto } from '../../../skill/dtos/skill-filter.dto';
import { SkillService } from '../../../skill/services/skill.service';
import { CategoryService } from '../../../category/category.service';
import { FilterParams } from '../../../../common/types/filter-params.type';
import { CategoryFilterDto } from '../../../category/dtos/category-filter.dto';
import { Observable } from 'rxjs';
import { PageResponse } from '../../../../common/interfaces/page-result.interface';
import { Store } from '@ngrx/store';
import { UserSkillState } from '../../store/user-skill.state';
import { UserSkillActions } from '../../store/user-skill.actions';
import { UserSkillDto } from '../../dtos/user-skill.dto';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-user-skill-add',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatIconModule,
    FormsModule,
    FlexLayoutModule,
    CommonModule,
    RemoteSearchableSelect,
    MatMenuModule,
  ],
  templateUrl: './user-skill-add.html',
  styleUrl: './user-skill-add.scss',
})
export class UserSkillAdd {
  category = signal<Category | null>(null);
  skill = signal<Skill | null>(null);

  skillExtraFilters = computed(
    (): Partial<SkillFilterDto> => ({
      categoryId: this.category()?.id,
      userSkills: false,
    }),
  );

  private skillService = inject(SkillService);
  private categoryService = inject(CategoryService);
  private store = inject(Store<UserSkillState>);

  constructor() {
    this.resetSkill();
  }

  private resetSkill() {
    effect(() => {
      this.category();
      this.skill.set(null);
    });
  }

  categoryLabel = (item: Category) => item.name;
  trackCategory = (item: Category) => item.id;
  fetchCategoryFn = (
    params: FilterParams<CategoryFilterDto>,
  ): Observable<PageResponse<Category>> => {
    return this.categoryService.get(params);
  };

  skillLabel = (item: Skill) => item.name;
  trackSkill = (item: Skill) => item.id;
  fetchSkillFn = (params: FilterParams<SkillFilterDto>): Observable<PageResponse<Skill>> => {
    return this.skillService.get(params);
  };

  onSubmit(form: NgForm): void {
    if (form.valid) {
      const userSkillData = form.value;

      const userSkillDto: UserSkillDto = {
        skillId: userSkillData.skill.id,
        ...(userSkillData.description && { description: userSkillData.description }),
      };

      this.store.dispatch(UserSkillActions.createUserSkill({ userSkillDto }));
    }
  }
}
