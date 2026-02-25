import { Routes } from '@angular/router';
import { offerRoutes } from '../offer/offer.routes';
import { userSkillRoutes } from '../user-skill/user-skill.routes';

export const dashboardRoutes: Routes = [
  {
    path: '',
    redirectTo: 'offers',
    pathMatch: 'full',
  },
  { path: 'offers', children: offerRoutes },
  { path: 'skills', children: userSkillRoutes },
];
