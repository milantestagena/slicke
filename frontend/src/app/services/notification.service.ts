import { Injectable, signal, effect } from '@angular/core';

export type NotificationType = 'success' | 'error';

export interface NotificationMessage {
  type: NotificationType;
  text: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _message = signal<NotificationMessage | null>(null);
  readonly message = this._message.asReadonly();

  private timeoutHandle: any;

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
