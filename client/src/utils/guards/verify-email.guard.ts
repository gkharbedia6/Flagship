import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthFacadeService } from '../../data/auth';

@Injectable({
  providedIn: 'root',
})
export class VerifyEmailGuard implements CanActivate {
  private _router = inject(Router);
  private _authFacade = inject(AuthFacadeService);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    if (!this._authFacade.getSignUpSession()) {
      this._router.navigate(['auth/sign-up']);
      return false;
    }
    return true;
  }
}
