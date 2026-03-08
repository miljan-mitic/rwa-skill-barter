import { Routes } from '@angular/router';
import { CategoryDashboard } from './components/category-dashboard/category-dashboard';
import { CategoryCreate } from './components/category-create/category-create';

export const categoryRoutes: Routes = [
  { path: '', component: CategoryDashboard },
  {
    path: 'create',
    component: CategoryCreate,
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
