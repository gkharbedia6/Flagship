import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { AuthFacadeService } from '../../data/auth';
import { Location } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private _authFacade = inject(AuthFacadeService);
  private _router = inject(Router);
  private _location = inject(Location);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isAuthenticated = this._authFacade.getIsAuthenticated();
    if (!isAuthenticated) {
      const p = this._location.path();
      this._router.navigate(['/auth'], p ? { queryParams: { returnUrl: p } } : {});
      return false;
    }
    return true;
  }
}
