import { Injectable, inject } from '@angular/core';
import { HTTPService } from './http.service';
import { NotificationService } from './notification.service';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private http = inject(HTTPService);
  private notification = inject(NotificationService);
  private storeService = inject(StoreService);
  sendMessage(message: string, recipientName: string): void {
    const payload = { message };

    this.http
      .postRequestWithAuth(`send_message_to_username/${recipientName}`, payload)
      .subscribe({
        next: () => {
          this.notification.show('success', 'Message sent');
          this.storeService.getConversations();
        },
        error: (err) => {
          if (err.status === 404) {
            this.notification.show('error', 'User not found');
          } else {
            this.notification.show('error', 'Failed to send message');
          }
          console.error(err);
        },
      });
  }
}
