import { Injectable, signal, effect, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HTTPService } from './http.service';

export type NotificationType = 'success' | 'error';

export interface NotificationMessage {
  type: NotificationType;
  text: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private httpService = inject(HTTPService);
  private _message = signal<NotificationMessage | null>(null);
  readonly message = this._message.asReadonly();

  private timeoutHandle: any;

  requestWithNotification<T>(
    method: 'get' | 'post' | 'put',
    requestUrl: string,
    withAuth: boolean = true,
    data?: any,
    successMessage?: string,
    errorMessage?: string
  ): Observable<T> {
    let request;
    if (withAuth) {
      request =
        method === 'get'
          ? this.httpService.getRequestWithAuth(requestUrl)
          : method === 'post'
          ? this.httpService.postRequestWithAuth(requestUrl, data)
          : this.httpService.putRequestWithAuth(requestUrl, data);
    } else {
      request =
        method === 'get'
          ? this.httpService.getRequest(requestUrl)
          : method === 'post'
          ? this.httpService.postRequest(requestUrl, data)
          : this.httpService.putRequest(requestUrl, data);
    }

    return request.pipe(
      tap({
        next: () => {
          this.show(
            'success',
            successMessage || 'Request successful'
          );
        },
        error: () => {
          this.show('error', errorMessage || 'An error occurred');
        },
      })
    );
  }
  show(type: NotificationType, text: string) {
    this._message.set({ type, text });

    // Reset prethodni timeout ako postoji
    clearTimeout(this.timeoutHandle);
    this.timeoutHandle = setTimeout(() => {
      this.clear();
    }, 5000);
  }

  clear() {
    this._message.set(null);
  }
}
