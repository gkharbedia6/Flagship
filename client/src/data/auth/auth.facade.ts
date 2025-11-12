import { DestroyRef, inject, Injectable } from '@angular/core';
import { AuthApiService } from '../api';
import { filter, tap, throwError } from 'rxjs';
import { AuthStateService } from './auth.state';
import { iSignUpResponse, iSubmitCodeResponse, iUser, iVerifyEmailResponse } from '../../types';
import { NavigationStart, Router } from '@angular/router';
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

  constructor() {
    this._router.events
      .pipe(
        filter((e): e is NavigationStart => e instanceof NavigationStart),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe(() => {
        this._state.setError(null);
        this._state.setIsLoading(false);
        this._state.setForgotPasswordStep('submit_code');
      });
  }

  loadCurrentUserInfo() {
    if (!this._state.getIsAuthenticated()) return;
    return this._authApi.getCurrentUser().pipe(
      tap((user: iUser) => {
        this.handleSignIn(user);
      })
    );
  }

  getForgotPasswordStep() {
    return this._state.getForgotPasswordStep();
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
          this._state.setSignUpSession(response);
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
    const sessionEmail = this._state.getSignUpSession()?.email;
    if (!sessionEmail) {
      this._state.setIsLoading(false);
      this._router.navigate(['auth/sign-up']);
      throw new Error('Session timed out.');
    }
    return this._authApi
      .verifyEmail({ verificationCode, email: sessionEmail })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response: iVerifyEmailResponse) => {
          console.log(response.message);
          // add alert
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

  requestForgotPasswordCode(email: string) {
    this._state.setIsLoading(true);
    return this._authApi.requestForgotPasswordCode(email).subscribe({
      next: (response: any) => {
        console.log(response);
        this._state.setForgotPasswordStep('submit_code');
        this._state.setForgotPasswordSession(response);
        this._state.setError(null);
        this._state.setIsLoading(false);
        //  this.resetCodeSuccess.emit();
      },
      error: (error: any) => {
        this._state.setError(error);
        this._state.setIsLoading(false);
      },
    });
  }

  submitForgotPasswordCode(verificationCode: string) {
    this._state.setIsLoading(true);
    const sessionEmail = this._state.getForgotPasswordSession()?.email;
    if (!sessionEmail) {
      this._state.setIsLoading(false);
      this._state.setForgotPasswordStep('request_code');
      throw new Error('Session timed out.');
    }
    return this._authApi
      .submitCode({ verificationCode, email: sessionEmail })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response: iSubmitCodeResponse) => {
          console.log(response.message);
          // add alert
          this._state.setForgotPasswordStep('recover_password');
          this._state.setError(null);
          this._state.setIsLoading(false);
        },
        error: (error: HttpErrorResponse) => {
          this._state.setIsLoading(false);
          this._state.setError(error);
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
