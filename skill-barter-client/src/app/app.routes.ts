import { Routes } from '@angular/router';
import { Signup } from './features/auth/components/signup/signup';
import { Login } from './features/auth/components/login/login';
import { canActivateAuth, canMatchAuth } from './features/auth/guards/auth.guard';
import { dashboardRoutes } from './features/dashboard/dashboard.routes';

export const appRoutes: Routes = [
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  {
    path: 'dashboard',
    children: dashboardRoutes,
    canActivate: [canActivateAuth],
    canMatch: [canMatchAuth],
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' },
];
