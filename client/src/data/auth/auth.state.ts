import { inject, Injectable, signal } from '@angular/core';
import { iSignUpResponse, iUser } from '../../types';
import { STORAGE } from './tokens/storage.token';
import { HttpErrorResponse } from '@angular/common/http';
import { SESSION_STORAGE } from './tokens/session-storage.token';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private _IS_AUTHENTICATED_KEY = 'isAuthenticated';
  private _SIGN_UP_SESSION = 'signUpSession';

  private _user = signal<iUser | null>(null);
  private _error = signal<HttpErrorResponse | null>(null);
  private _isLoading = signal<boolean>(false);
  private _storage = inject<Storage>(STORAGE);
  private _session = inject<Storage>(SESSION_STORAGE);

  constructor() {}

  getSignUpSession() {
    const session = sessionStorage.getItem(this._SIGN_UP_SESSION);
    if (!session) return null;

    const data = JSON.parse(session) as iSignUpResponse['data'];
    if (Date.now() > data.verificationExpires) {
      sessionStorage.removeItem(this._SIGN_UP_SESSION);
      return null;
    }

    return data;
  }

  setSignUpSession(data: iSignUpResponse) {
    this._session.setItem(this._SIGN_UP_SESSION, JSON.stringify(data.data));
  }

  clearSignUpSession() {
    this._session.removeItem(this._SIGN_UP_SESSION);
  }

  setIsLoading(b: boolean) {
    this._isLoading.set(b);
  }

  getIsLoading() {
    return this._isLoading();
  }

  setError(error: HttpErrorResponse | null) {
    this._error.set(error);
  }

  getError() {
    return this._error();
  }

  setUser(user: iUser | null) {
    this._user.set(user);
  }

  getUser() {
    return this._user;
  }

  setIsAuthenticated(b: boolean) {
    this._storage.setItem(this._IS_AUTHENTICATED_KEY, JSON.stringify(b));
  }

  getIsAuthenticated() {
    return JSON.parse(this._storage.getItem(this._IS_AUTHENTICATED_KEY) ?? '{}');
  }
}
