import { inject, Injectable } from '@angular/core';
import { iLoginForm, iRegisterForm, iUser } from '../../types';
import { Observable } from 'rxjs';
import { HttpRequestService } from '../http';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private _baseUrl = 'auth';
  private _httpRequest = inject(HttpRequestService);

  register(body: iRegisterForm): Observable<iUser> {
    return this._httpRequest.post(`${this._baseUrl}/register`, body);
  }

  login(body: iLoginForm): Observable<any> {
    return this._httpRequest.post(`${this._baseUrl}/login`, body);
  }

  logout(id: string) {
    return this._httpRequest.post(`${this._baseUrl}/logout`, { id });
  }

  getCurrentUser(): Observable<any> {
    return this._httpRequest.get(`${this._baseUrl}/me`);
  }
}
