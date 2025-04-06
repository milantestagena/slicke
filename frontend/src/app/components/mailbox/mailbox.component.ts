import {
  Component,
  effect,
  inject,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { Conversation, ConversationWithUser, User } from '../../models';
import { AppStore } from '../../store/app.store';
import { StoreService } from '../../services/store.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mailbox',
  templateUrl: './mailbox.component.html',
  styleUrls: ['./mailbox.component.scss'],
  standalone: true, // Ensure this is a standalone component
  imports: [CommonModule], // Add CommonModule here
})
export class MailboxComponent {
  store: any;
  user: User | null = null;
  conversations: Conversation[] = [];
  activeConversation: Conversation  = {} as Conversation;
  conversationsWithUsers: { [userId: number]: ConversationWithUser } = {};
  correspondentId!: number;
  correspondentName!: string;

  constructor(private storeService: StoreService) {
    this.store = inject(AppStore);
    const injector = inject(Injector);
    this.storeService.getConversations();
    console.log('store', this.store);
    runInInjectionContext(injector, () => {
      effect(() => {
        this.user = this.store.getUser();
        this.conversations = this.store.getConversations();
        this.conversationsWithUsers = this.store.getAllConversationsWithUsers();
      });
    });
  }

  selectUser(conversation: Conversation) {
    const corenspondentId =
      conversation.sender_id === this.user?.id
        ? conversation.receiver_id
        : conversation.sender_id;
    this.storeService.getConversationWithUser(corenspondentId);
    this.activeConversation = conversation;
    this.correspondentId = this.getCorrespondentId();
    this.correspondentName = this.getCorrespondentName();
  }

  getCorrespondentName(): string {
    return this.activeConversation.sender_id === this.user?.id
      ? this.activeConversation.receiver_name
      : this.activeConversation.sender_name;
  }
  getCorrespondentId(): number {
    return this.activeConversation.sender_id === this.user?.id
      ? this.activeConversation.receiver_id
      : this.activeConversation.sender_id;
  }
}
