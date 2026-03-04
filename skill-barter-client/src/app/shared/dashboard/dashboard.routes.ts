import { Routes } from '@angular/router';
import { offerRoutes } from '../../features/offer/offer.routes';
import { userSkillRoutes } from '../../features/user-skill/user-skill.routes';
import { NotificationORList } from '../../features/notification-or/components/notification-or-list/notification-or-list';
import { BarterDashboard } from '../../features/barter/components/barter-dashboard/barter-dashboard';

export const dashboardRoutes: Routes = [
  {
    path: '',
    redirectTo: 'offers',
    pathMatch: 'full',
  },
  { path: 'offers', children: offerRoutes },
  { path: 'skills', children: userSkillRoutes },
  { path: 'barters', component: BarterDashboard },
  { path: 'notifications-or', component: NotificationORList },
  { path: '**', redirectTo: 'offers', pathMatch: 'full' },
];
