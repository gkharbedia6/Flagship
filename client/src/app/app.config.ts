import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthFacadeService } from '../data/auth/auth.facade';
import { STORAGE } from '../data/auth/tokens/storage.token';
import { AuthInterceptor } from '../utils/interceptors';
import { SESSION_STORAGE } from '../data/auth/tokens/session-storage.token';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { ThemeService } from '../data/theme/theme.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAppInitializer(() => {
      const themeService = inject(ThemeService);
      const authFacade = inject(AuthFacadeService);
      themeService.initializeAppTheme();
      return authFacade.loadCurrentUserInfo();
    }),
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    { provide: STORAGE, useValue: localStorage },
    { provide: SESSION_STORAGE, useValue: sessionStorage },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000 } },
  ],
};
