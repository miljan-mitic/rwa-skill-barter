import { Routes } from '@angular/router';
import { AdminPanel } from './components/admin-panel/admin-panel';
import { skillRoutes } from '../skill/skill.routes';
import { categoryRoutes } from '../category/category.routes';
import { UserDashboard } from '../user/components/user-dashboard/user-dashboard';

export const adminPanelRoutes: Routes = [
  { path: '', redirectTo: 'categories', pathMatch: 'full' },
  {
    path: 'skills',
    children: skillRoutes,
  },
  {
    path: 'categories',
    children: categoryRoutes,
  },
  {
    path: 'users',
    component: UserDashboard,
  },
  { path: '**', redirectTo: 'categories', pathMatch: 'full' },
];
