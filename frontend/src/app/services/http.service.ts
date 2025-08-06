import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class HTTPService {
  private apiUrl = 'http://localhost:8000/api';
  private notification = inject(NotificationService);
  constructor(private http: HttpClient) {}

  getRequest(requestUrl: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${requestUrl}`);
  }

  getRequestWithAuth(
    requestUrl: string,
    params?: { [key: string]: string }
  ): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const paramsString = new URLSearchParams(params).toString();
    return this.http.get(`${this.apiUrl}/${requestUrl}?${paramsString}`, {
      headers,
    });
  }

  postRequest(requestUrl: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${requestUrl}`, data);
  }

  postRequestWithAuth(requestUrl: string, data: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/${requestUrl}`, data, { headers });
  }

  putRequest(requestUrl: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${requestUrl}`, data);
  }

  putRequestWithAuth(requestUrl: string, data: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${requestUrl}`, data, { headers });
  }

  requestWithNotification<T>(
    method: 'get' | 'post' | 'put',
    requestUrl: string,
    withAuth: boolean = true,
    data?: any,
    successMessage?: string,
    errorMessage?: string
  ): Observable<T> {
    let request;
    if(withAuth) {
      request = method === 'get'
      ? this.getRequestWithAuth(requestUrl)
      : method === 'post'
      ? this.postRequestWithAuth(requestUrl, data)
      : this.putRequestWithAuth(requestUrl, data);
    } else {
      request = method === 'get'
      ? this.getRequest(requestUrl)
      : method === 'post'
      ? this.postRequest(requestUrl, data)
      : this.putRequest(requestUrl, data);
    }

    return request.pipe(
      tap({
        next: () => {
          this.notification.show('success', successMessage || 'Request successful');
        },
        error: () => {
          this.notification.show('error', errorMessage || 'An error occurred');
        },
      })
    );
  };

  sendMessage(message: string, recipientName: number): void {}
}
