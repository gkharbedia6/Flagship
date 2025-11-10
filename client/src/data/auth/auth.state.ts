import { inject, Injectable, Signal, signal } from '@angular/core';
import { iUser } from '../../types';
import { STORAGE } from './tokens/storage.token';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private _user = signal<iUser | null>(null);
  private _storage = inject<Storage>(STORAGE);

  constructor() {}

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
