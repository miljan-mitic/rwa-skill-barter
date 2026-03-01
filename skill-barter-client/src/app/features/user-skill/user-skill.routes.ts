import { Routes } from '@angular/router';
import { UserSkillAdd } from './components/user-skill-add/user-skill-add';
import { UserSkillDashboard } from './components/user-skill-dashboard/user-skill-dashboard';
import { UserSkillDetails } from './components/user-skill-details/user-skill-details';

export const userSkillRoutes: Routes = [
  { path: '', component: UserSkillDashboard },
  { path: 'add', component: UserSkillAdd },
  { path: ':id', component: UserSkillDetails },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
