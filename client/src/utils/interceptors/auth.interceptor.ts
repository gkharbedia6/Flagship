import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthFacadeService } from '../../data/auth';
import { AlertService } from '../../feature/shared/feature/alert/alert.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  private _authFacade = inject(AuthFacadeService);
  private _alert = inject(AlertService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this._authFacade.handleSignOut();
        }
        this._alert.alert(error.error.message, 'error');
        return throwError(() => error);
      })
    );
  }
}
