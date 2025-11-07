import { inject, Injectable } from '@angular/core';
import { iLoginForm, iRegisterForm, iRegisterResponse } from '../../../types';
import { Observable } from 'rxjs';
import { HttpRequestService } from '../../http';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private _ulr = 'auth';
  private _httpRequestService = inject(HttpRequestService);

  register(body: iRegisterForm): Observable<iRegisterResponse> {
    return this._httpRequestService.post('auth/register', body);
  }

  login(body: iLoginForm): Observable<any> {
    return this._httpRequestService.post('auth/login', body, {}, true);
  }
}
