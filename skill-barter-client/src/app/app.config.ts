import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  isDevMode,
  provideAppInitializer,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { appReducers } from './store/app.reducer';
import { appEffects } from './store/app.effects';
import { AppState } from './store/app.state';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { MessageService } from 'primeng/api';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeuix/themes/lara';
import { provideSocketIo } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { authenticationInterceptor } from './features/auth/interceptors/auth.interceptor';
import { authInitializer } from './features/auth/initializers/auth.initializer';
import { provideRouterStore } from '@ngrx/router-store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideStore<AppState>(appReducers),
    provideEffects(appEffects),
    provideRouterStore(),
    provideHttpClient(withInterceptors([authenticationInterceptor])),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideAnimations(),
    MessageService,
    providePrimeNG({
      theme: {
        preset: Lara,
      },
    }),
    provideSocketIo({
      url: `${environment.api}/call`,
      options: { transports: ['websocket'], reconnection: true },
    }),
    provideAppInitializer(authInitializer),
    provideRouterStore(),
  ],
};
