import { Routes } from '@angular/router';
import { SkillList } from './components/skill-list/skill-list';
import { SkillAdd } from './components/skill-add/skill-add';

export const skillRoutes: Routes = [
  { path: '', component: SkillList },
  { path: 'add', component: SkillAdd },
];
