import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { CategoryFilters } from '../category-filters/category-filters';
import { CategoryList } from '../category-list/category-list';

@Component({
  selector: 'app-category-dashboard',
  imports: [MatCardModule, FlexLayoutModule, CategoryFilters, CategoryList],
  templateUrl: './category-dashboard.html',
  styleUrl: './category-dashboard.scss',
})
export class CategoryDashboard {}
