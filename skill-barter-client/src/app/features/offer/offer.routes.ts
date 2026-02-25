import { Routes } from '@angular/router';
import { OfferCreate } from './components/offer-create/offer-create';
import { OfferDetails } from './components/offer-details/offer-details';
import { OfferDashboard } from './components/offer-dashboard/offer-dashboard';

export const offerRoutes: Routes = [
  { path: '', component: OfferDashboard, data: { global: true } },
  {
    path: 'create',
    component: OfferCreate,
  },
  {
    path: ':id',
    component: OfferDetails,
  },
];
