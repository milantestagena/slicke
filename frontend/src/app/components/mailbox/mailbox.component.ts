import {
  Component,
  ComponentRef,
  computed,
  effect,
  inject,
  Injector,
  runInInjectionContext,
  signal,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Conversation, ConversationWithUser, User } from '../../models';
import { AppStore } from '../../store/app.store';
import { StoreService } from '../../services/store.service';
import { CommonModule } from '@angular/common';
import { CreateMessageFormComponent } from './create-message-form/create-message-form.component';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-mailbox',
  templateUrl: './mailbox.component.html',
  styleUrls: ['./mailbox.component.scss'],
  standalone: true, // Ensure this is a standalone component
  imports: [CommonModule], // Add CommonModule here
})
export class MailboxComponent {
  @ViewChild('formContainer', { read: ViewContainerRef })
  formContainer!: ViewContainerRef;

  createMessageFormRef: ComponentRef<CreateMessageFormComponent> | null = null;
  private messageService = inject(MessageService);
  private storeService = inject(StoreService);

  store: any;
  user: User | null = null;
  activeConversation;
  correspondentId = signal<number>(0);
  correspondentName!: string;

  conversations = this.storeService.store.Conversations;
  conversationsWithUsers = this.storeService.store.ConversationWithUser;

  isFormVisible = signal(false);

  constructor() {
    this.store = inject(AppStore);
    const injector = inject(Injector);
    this.storeService.getConversations();
    this.activeConversation = computed(() => {
      const id = this.correspondentId();
      return id ? this.conversationsWithUsers()[id] : null;
    });
    runInInjectionContext(injector, () => {
      effect(() => {
        this.user = this.store.getUser();
      });
    });
  }

  selectUser(conversation: Conversation) {
    this.isFormVisible.set(false);
    const correspondentId =
      conversation.sender_id === this.user?.id
        ? conversation.receiver_id
        : conversation.sender_id;

    this.correspondentId.set(correspondentId);
    this.correspondentName =
      conversation.sender_id === this.user?.id
        ? conversation.receiver_name
        : conversation.sender_name;

    this.storeService.getConversationWithUser(correspondentId);
  }

  getCorrespondentName(): string {
    const activeConv = this.activeConversation();
    return activeConv?.sender_id === this.user?.id
      ? activeConv?.receiver_name
      : activeConv?.sender_name;
  }
  getCorrespondentId(): number {
    const activeConv = this.activeConversation();
    return activeConv?.sender_id === this.user?.id
      ? activeConv?.receiver_id
      : activeConv?.sender_id;
  }

  showCreateMailForm(event: MouseEvent) {
    event.preventDefault();
    this.formContainer.clear();
    this.isFormVisible.set(true);
    this.createMessageFormRef = this.formContainer.createComponent(
      CreateMessageFormComponent
    );

    this.createMessageFormRef.instance.formSubmit.subscribe((data) => {
      this.messageService.sendMessage(data.message, data.recipient);
      this.formContainer.clear();
      this.isFormVisible.set(false);
      this.correspondentId.set(0)
    });
  }
}
