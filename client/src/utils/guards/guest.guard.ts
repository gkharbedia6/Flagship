import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { AuthFacadeService } from '../../data/auth';
import { Location } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  private _authFacade = inject(AuthFacadeService);
  private _router = inject(Router);
  private _location = inject(Location);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isAuthenticated = this._authFacade.getIsAuthenticated();
    if (!isAuthenticated) {
      return true;
    }
    this._router.navigate(['/']);
    return false;
  }
}
