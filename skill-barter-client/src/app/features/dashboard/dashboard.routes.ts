import { Routes } from '@angular/router';
import { offerRoutes } from '../offer/offer.routes';
import { userSkillRoutes } from '../user-skill/user-skill.routes';
import { NotificationORList } from '../notification-or/components/notification-or-list/notification-or-list';

export const dashboardRoutes: Routes = [
  {
    path: '',
    redirectTo: 'offers',
    pathMatch: 'full',
  },
  { path: 'offers', children: offerRoutes },
  { path: 'skills', children: userSkillRoutes },
  { path: 'notifications-or', component: NotificationORList },
  { path: '**', redirectTo: 'offers', pathMatch: 'full' },
];
