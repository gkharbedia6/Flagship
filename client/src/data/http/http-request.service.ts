import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpRequestService {
  private _http = inject(HttpClient);
  private _url = 'http://localhost:8080/api';

  get<T>(methodUrl: string, params?: any, withCredentials?: boolean): Observable<T> {
    return this._http.get<T>(`${this._url}/${methodUrl}`, {
      params: new HttpParams(params),
      withCredentials: withCredentials,
    });
  }

  post<T>(methodUrl: string, body: any, params?: any, withCredentials?: boolean): Observable<T> {
    return this._http.post<T>(`${this._url}/${methodUrl}`, body, {
      params: new HttpParams(params),
      withCredentials: withCredentials,
    });
  }

  put<T>(methodUrl: string, body: any, params?: any, withCredentials?: boolean): Observable<T> {
    return this._http.put<T>(`${this._url}/${methodUrl}`, body, {
      params: new HttpParams(params),
      withCredentials: withCredentials,
    });
  }

  delete<T>(methodUrl: string, params?: any, withCredentials?: boolean): Observable<T> {
    return this._http.delete<T>(`${this._url}/${methodUrl}`, {
      params: new HttpParams(params),
      withCredentials: withCredentials,
    });
  }
}
