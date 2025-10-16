import { Routes } from '@angular/router';
import { Signup } from './features/auth/components/signup/signup';
import { Login } from './features/auth/components/login/login';
import { Home } from './shared/components/home/home';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  {
    path: '',
    children: [{ path: 'home', component: Home }],
  },
  { path: '**', redirectTo: '/home' },
];
