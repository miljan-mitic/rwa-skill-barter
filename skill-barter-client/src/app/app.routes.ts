import { Routes } from '@angular/router';
import { Signup } from './features/auth/components/signup/signup';
import { Login } from './features/auth/components/login/login';
import { canActivateAuth, canMatchAuth } from './features/auth/guards/auth.guard';
import { dashboardRoutes } from './features/dashboard/dashboard.routes';
import { Dashboard } from './features/dashboard/components/dashboard/dashboard';
import { canActivateNoAuth, canMatchNoAuth } from './features/auth/guards/no-auth.guard';

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
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' },
];
