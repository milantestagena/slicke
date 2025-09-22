import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize, Observable, tap } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class HTTPService {
  private apiUrl = 'http://localhost:8000/api';
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

  deleteRequest(requestUrl: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${requestUrl}`);
  }

  deleteRequestWithAuth(requestUrl: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/${requestUrl}`, { headers });
  }



  sendMessage(message: string, recipientName: number): void {}
}
