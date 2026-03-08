import { Routes } from '@angular/router';
import { SkillDashboard } from './components/skill-dashboard/skill-dashboard';
import { SkillCreate } from './components/skill-create/skill-create';

export const skillRoutes: Routes = [
  { path: '', component: SkillDashboard },
  {
    path: 'create',
    component: SkillCreate,
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
