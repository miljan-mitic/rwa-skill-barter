import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { offerRoutes } from '../offer/offer.routes';
import { skillRoutes } from '../skill/skill.routes';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: Dashboard,
    children: [
      { path: 'offers', children: offerRoutes },
      { path: 'skills', children: skillRoutes },
    ],
  },
];
