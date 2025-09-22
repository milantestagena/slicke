import { Injectable, inject } from '@angular/core';
import { HTTPService } from './http.service';
import { GetUrls } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private http = inject(HTTPService);

  sendMessage(message: string, recipientName: string) {
    const payload = { message };
    return this.http.postRequestWithAuth(
      `send_message_to_username/${recipientName}`,
      payload
    );
  }

  getConversations() {
    return this.http.getRequestWithAuth(GetUrls.GET_CONVERSATIONS);
  }
  getConversationWithUser(corenspondentId: number) {
    return this.http.getRequestWithAuth(
      `${GetUrls.GET_CONVERSATION_WITH_USER}/${corenspondentId}`
    );
  }
}
