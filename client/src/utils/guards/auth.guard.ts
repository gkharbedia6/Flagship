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
    const currentPath = this._location.path();

    console.log('ye2 ', route, state);

    if (!isAuthenticated) {
      if (!currentPath.startsWith('/auth') && currentPath !== '') {
        this._router.navigate(['/auth'], {
          queryParams: { returnUrl: currentPath },
        });
      } else {
        this._router.navigate(['/auth']);
      }
      return false;
    }

    return true;
  }
}
