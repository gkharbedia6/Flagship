import { DestroyRef, inject, Injectable } from '@angular/core';
import { AuthApiService } from '../api';
import { tap } from 'rxjs';
import { AuthStateService } from './auth.state';
import { iUser } from '../../types';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthFacadeService {
  private _state = inject(AuthStateService);
  private _authApi = inject(AuthApiService);
  private _router = inject(Router);
  private _destroyRef = inject(DestroyRef);

  loadCurrentUserInfo() {
    if (!this._state.getIsAuthenticated()) return;
    return this._authApi.getCurrentUser().pipe(
      tap((user: iUser) => {
        this.handleSignIn(user);
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

  getIsLoading() {
    return this._state.getIsLoading();
  }

  getError() {
    return this._state.getError();
  }

  signIn(email: string, password: string) {
    this._state.setIsLoading(true);
    return this._authApi
      .signIn({ email, password })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (user: iUser) => {
          this._state.setError(null);
          this._state.setIsLoading(false);
          this.handleSignIn(user);
          this._router.navigate(['/']);
        },
        error: (error: HttpErrorResponse) => {
          this._state.setError(error);
          this._state.setIsLoading(false);
        },
      });
  }

  signOut(userId: string) {
    return this._authApi.signOut(userId).pipe(
      tap(() => {
        this.handleSignOut();
      })
    );
  }

  handleSignIn(user: iUser) {
    this._state.setUser(user);
    this._state.setIsAuthenticated(true);
  }

  handleSignOut() {
    this._state.setUser(null);
    this._state.setIsAuthenticated(false);
    this._router.navigateByUrl('/auth');
  }
}
