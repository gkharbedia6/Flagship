import { DestroyRef, inject, Injectable } from '@angular/core';
import { AuthApiService } from '../api';
import { tap, throwError } from 'rxjs';
import { AuthStateService } from './auth.state';
import { iSignUpResponse, iUser, iVerifyEmailResponse } from '../../types';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthFacadeService {
  private _state = inject(AuthStateService);
  private _authApi = inject(AuthApiService);
  private _router = inject(Router);
  private _destroyRef = inject(DestroyRef);
  private _location = inject(Location);

  loadCurrentUserInfo() {
    if (!this._state.getIsAuthenticated()) return;
    return this._authApi.getCurrentUser().pipe(
      tap((user: iUser) => {
        this.handleSignIn(user);
      })
    );
  }

  getSignUpSession() {
    return this._state.getSignUpSession();
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

  signUp(email: string, password: string) {
    this._state.setIsLoading(true);
    return this._authApi
      .signUp({ email, password })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response: iSignUpResponse) => {
          this.handleSignUp(response);
          this._state.setError(null);
          this._state.setIsLoading(false);
          this._router.navigate(['/auth/verify-email']);
        },
        error: (error: HttpErrorResponse) => {
          this._state.setIsLoading(false);
          this._state.setError(error);
        },
      });
  }

  verifyEmail(verificationCode: string) {
    this._state.setIsLoading(true);
    const email = this._state.getSignUpSession()?.email;
    if (!email) {
      this._state.setIsLoading(false);
      return throwError(() => {
        console.log('Verification timed out.');
        this._router.navigate(['auth/sign-up']);
      });
    }
    return this._authApi
      .verifyEmail({ verificationCode, email })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response: iVerifyEmailResponse) => {
          console.log(response.message);
          this._state.setError(null);
          this._state.setIsLoading(false);
          this._state.clearSignUpSession();
          this._router.navigate(['/auth/sign-in']);
        },
        error: (error: HttpErrorResponse) => {
          this._state.setIsLoading(false);
          this._state.setError(error);
        },
      });
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
          const returnUrl = this._location.path().split('returnUrl=%2F');
          const url = !returnUrl[1] ? '/' : `/${returnUrl[1]}`;
          this._router.navigateByUrl(url);
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

  handleSignUp(response: iSignUpResponse) {
    this._state.setSignUpSession(response);
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
