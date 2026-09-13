import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Inject, Injector } from '@angular/core';
import { Observable, from, switchMap } from 'rxjs';
import { MsalService } from '@azure/msal-angular';
import { InteractionType } from '@azure/msal-browser';
import { environment } from '../../environments/environment';

@Injectable()
export class MsalInterceptor implements HttpInterceptor {
  constructor(
    private msalService: MsalService,
    private injector: Injector
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = req.url;
    const isApiCall = url.startsWith(environment.apiGateway.baseUrl) ||
                       url.includes('/api/reservations') ||
                       url.includes('/api/catalog');

    if (!isApiCall) {
      return next.handle(req);
    }

    const account = this.msalService.instance.getActiveAccount();
    if (!account) {
      return next.handle(req);
    }

    return from(
      this.msalService.instance.acquireTokenSilent({
        scopes: [environment.msal.apiScope],
        account
      })
    ).pipe(
      switchMap((result) => {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${result.accessToken}`
          }
        });
        return next.handle(authReq);
      })
    );
  }
}
