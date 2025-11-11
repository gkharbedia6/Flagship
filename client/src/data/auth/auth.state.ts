import { inject, Injectable, signal } from '@angular/core';
import { iUser } from '../../types';
import { STORAGE } from './tokens/storage.token';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private _user = signal<iUser | null>(null);
  private _error = signal<HttpErrorResponse | null>(null);
  private _isLoading = signal<boolean>(false);
  private _storage = inject<Storage>(STORAGE);

  constructor() {}

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
    this._storage.setItem('isAuthenticated', JSON.stringify(b));
  }

  getIsAuthenticated() {
    return JSON.parse(this._storage.getItem('isAuthenticated') ?? '{}');
  }
}
