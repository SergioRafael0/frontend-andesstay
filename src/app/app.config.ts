import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MsalModule, MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { IPublicClientApplication, InteractionType } from '@azure/msal-browser';

import { routes } from './app.routes';
import { MSALInstanceFactory, MSALGuardConfigFactory, MSALInterceptorConfigFactory } from './auth/msal.config';
import { MsalInterceptor } from './interceptors/msal.interceptor';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';

export function MsalInterceptorFactory() {
  return new MsalInterceptor('MSAL_INSTANCE' as any, ['/api/reservations', '/api/catalog']);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(MsalModule),
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    MsalService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    AuthGuard,
    RoleGuard
  ]
};
