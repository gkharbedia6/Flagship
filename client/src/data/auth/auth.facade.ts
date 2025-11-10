import { inject, Injectable } from '@angular/core';
import { AuthApiService } from '../api';
import { tap } from 'rxjs';
import { AuthStateService } from './auth.state';
import { iUser } from '../../types';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthFacadeService {
  private _state = inject(AuthStateService);
  private _authApi = inject(AuthApiService);
  private _router = inject(Router);

  loadCurrentUserInfo() {
    if (!this._state.getIsAuthenticated()) return;
    return this._authApi.getCurrentUser().pipe(
      tap((user: iUser) => {
        this.handleLogin(user);
      })
    );
  }

  getIsAuthenticated() {
    return this._state.getIsAuthenticated();
  }

  setIsAuthenticated(b: boolean) {
    return this._state.setIsAuthenticated(b);
  }

  getCurrentUser() {
    return this._state.getUser();
  }

  login(email: string, password: string) {
    return this._authApi.login({ email, password }).pipe(
      tap((user: iUser) => {
        this.handleLogin(user);
        this._router.navigate(['/']);
      })
    );
  }

  logout(userId: string) {
    return this._authApi.logout(userId).pipe(
      tap(() => {
        this.handleLogout();
      })
    );
  }

  handleLogin(user: iUser) {
    this._state.setUser(user);
    this._state.setIsAuthenticated(true);
  }

  handleLogout() {
    this._state.setUser(null);
    this._state.setIsAuthenticated(false);
    this._router.navigateByUrl('/auth');
  }
}
