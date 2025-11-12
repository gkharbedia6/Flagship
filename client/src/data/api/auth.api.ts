import { inject, Injectable } from '@angular/core';
import {
  iSignInForm,
  iSignUpForm,
  iSignUpResponse,
  iSubmitCodeForm,
  iSubmitCodeResponse,
  iUser,
  iVerificationForm,
  iVerifyEmailResponse,
} from '../../types';
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

  verifyEmail(body: iVerificationForm): Observable<iVerifyEmailResponse> {
    return this._httpRequest.post(`${this._baseUrl}/email-verification`, body);
  }

  signIn(body: iSignInForm): Observable<iUser> {
    return this._httpRequest.post(`${this._baseUrl}/sign-in`, body);
  }

  signOut(id: string) {
    return this._httpRequest.post(`${this._baseUrl}/sign-out`, { id });
  }

  getCurrentUser(): Observable<any> {
    return this._httpRequest.get(`${this._baseUrl}/me`);
  }

  requestForgotPasswordCode(email: string): Observable<any> {
    return this._httpRequest.post(`${this._baseUrl}/request-code`, { email });
  }

  submitCode(body: iSubmitCodeForm): Observable<iSubmitCodeResponse> {
    return this._httpRequest.post(`${this._baseUrl}/submit-code`, body);
  }
}
