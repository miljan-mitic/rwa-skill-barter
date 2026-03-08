import { Routes } from '@angular/router';
import { Signup } from './features/auth/components/signup/signup';
import { Login } from './features/auth/components/login/login';
import { canActivateAuth } from './features/auth/guards/auth.guard';
import { Dashboard } from './shared/dashboard/components/dashboard/dashboard';
import { dashboardRoutes } from './shared/dashboard/dashboard.routes';
import { canMatchNoAuth } from './features/auth/guards/no-auth.guard';
import { UserProfile } from './features/user/components/user-profile/user-profile';
import { AdminPanel } from './features/admin/components/admin-panel/admin-panel';
import { canActivateAdmin } from './features/admin/guards/admin.guard';
import { adminPanelRoutes } from './features/admin/admin-panel.routes';

export const appRoutes: Routes = [
  { path: 'login', component: Login, canMatch: [canMatchNoAuth] },
  {
    path: 'signup',
    component: Signup,
    canMatch: [canMatchNoAuth],
  },
  {
    path: 'dashboard',
    component: Dashboard,
    children: dashboardRoutes,
    canActivate: [canActivateAuth],
  },
  {
    path: 'user/profile',
    component: UserProfile,
    canActivate: [canActivateAuth],
  },
  {
    path: 'admin',
    component: AdminPanel,
    children: adminPanelRoutes,
    canActivate: [canActivateAuth, canActivateAdmin],
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' },
];
