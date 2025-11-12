import { inject, Injectable } from '@angular/core';
import { iSignInForm, iSignUpForm, iSignUpResponse, iUser, iVerificationForm } from '../../types';
import { Observable } from 'rxjs';
import { HttpRequestService } from '../http';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private _baseUrl = 'auth';
  private _httpRequest = inject(HttpRequestService);

  signUp(body: iSignUpForm): Observable<iSignUpResponse> {
    return this._httpRequest.post(`${this._baseUrl}/sign-up`, body);
  }

  verifyEmail(body: iVerificationForm): Observable<any> {
    return this._httpRequest.post(`${this._baseUrl}/email-verification`, body);
  }

  signIn(body: iSignInForm): Observable<any> {
    return this._httpRequest.post(`${this._baseUrl}/sign-in`, body);
  }

  signOut(id: string) {
    return this._httpRequest.post(`${this._baseUrl}/sign-out`, { id });
  }

  getCurrentUser(): Observable<any> {
    return this._httpRequest.get(`${this._baseUrl}/me`);
  }
}
