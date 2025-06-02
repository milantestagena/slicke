import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HTTPService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getRequest(requestUrl: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${requestUrl}`);
  }

  getRequestWithAuth(requestUrl: string, params?: { [key: string]: string }): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const paramsString = new URLSearchParams(params).toString();
    return this.http.get(`${this.apiUrl}/${requestUrl}?${paramsString}`, { headers });
  }

  postRequest(requestUrl: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${requestUrl}`, data);
  }

  postRequestWithAuth(requestUrl: string, data: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/${requestUrl}`, data, { headers });
  }

  sendMessage(
    message: string,
    recipientName: number,
  ): void {
  }

}
