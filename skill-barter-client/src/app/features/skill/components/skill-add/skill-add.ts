import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { RemoteSelect } from '../../../../shared/components/remote-select/remote-select';
import { SkillService } from '../../services/skill.service';
import { Category } from '../../../../common/models/category.model';
import { Skill } from '../../../../common/models/skill.model';
import { SkillFilterDto } from '../../dtos/skill-filter.dto';
import { CategoryFilterDto } from '../../../category/dtos/category-filter.dto';
import { CategoryService } from '../../../category/category.service';
import { PageResponse } from '../../../../common/interfaces/page-result.interface';
import { Observable } from 'rxjs/internal/Observable';
import { FilterParams } from '../../../../common/types/filter-params.type';

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
    RemoteSelect,
  ],
  templateUrl: './skill-add.html',
  styleUrl: './skill-add.scss',
})
export class SkillAdd {
  category = signal<Category | null>(null);
  skill = signal<Skill | null>(null);

  skillExtraFilters = computed(
    (): Partial<SkillFilterDto> => ({
      categoryId: this.category()?.id,
    }),
  );

  private skillService = inject(SkillService);
  private categoryService = inject(CategoryService);

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
      const skillData = form.value;
      console.log(skillData);
    }
  }
}
