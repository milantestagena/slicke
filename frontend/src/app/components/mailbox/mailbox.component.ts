import {
  Component,
  ComponentRef,
  OnInit,
  computed,
  inject,
  signal,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs/operators';
import { Conversation, ConversationWithUser, User } from '../../models';
import { AppStore } from '../../store/app.store';
import { CreateMessageFormComponent } from './create-message-form/create-message-form.component';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-mailbox',
  templateUrl: './mailbox.component.html',
  styleUrls: ['./mailbox.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class MailboxComponent implements OnInit {
  @ViewChild('formContainer', { read: ViewContainerRef })
  set formContainer(container: ViewContainerRef | undefined) {
    this.formContainerRef = container ?? null;
    if (this.formContainerRef && this.shouldRenderForm) {
      this.renderCreateMailForm();
    }
  }

  private formContainerRef: ViewContainerRef | null = null;
  private shouldRenderForm = false;

  private readonly store = inject(AppStore);
  private readonly messageService = inject(MessageService);

  private createMessageFormRef: ComponentRef<CreateMessageFormComponent> | null =
    null;

  readonly conversations = this.store.Conversations;
  private readonly conversationsWithUsers = this.store.ConversationWithUser;

  private readonly userSignal = this.store.user;
  get user(): User | null {
    return this.userSignal();
  }

  readonly correspondentId = signal<number>(0);
  readonly isFormVisible = signal(false);
  private readonly correspondentNameSignal = signal('');
  get correspondentName(): string {
    return this.correspondentNameSignal();
  }

  readonly activeConversation = computed<ConversationWithUser | null>(() => {
    const id = this.correspondentId();
    if (!id) {
      return null;
    }

    return this.conversationsWithUsers()[id] ?? null;
  });

  ngOnInit(): void {
    this.store.loadConversations();
  }

  selectUser(conversation: Conversation) {
    this.isFormVisible.set(false);
    this.shouldRenderForm = false;
    this.formContainerRef?.clear();
    const currentUserId = this.userSignal()?.id;
    if (!currentUserId) {
      return;
    }

    const correspondentId =
      conversation.sender_id === currentUserId
        ? conversation.receiver_id
        : conversation.sender_id;

    const correspondentName =
      conversation.sender_id === currentUserId
        ? conversation.receiver_name
        : conversation.sender_name;

    this.correspondentId.set(correspondentId);
    this.correspondentNameSignal.set(correspondentName);
    this.store.loadConversationWithUser(correspondentId);
  }

  showCreateMailForm(event: MouseEvent) {
    event.preventDefault();
    this.shouldRenderForm = true;
    this.isFormVisible.set(true);
    if (this.formContainerRef) {
      this.renderCreateMailForm();
    }
  }

  private renderCreateMailForm() {
    if (!this.formContainerRef) {
      return;
    }

    this.formContainerRef.clear();
    this.createMessageFormRef = this.formContainerRef.createComponent(
      CreateMessageFormComponent
    );

    this.createMessageFormRef.instance.formSubmit
      .pipe(take(1))
      .subscribe((data) => {
        this.messageService.sendMessage(data.message, data.recipient);
        this.formContainerRef?.clear();
        this.isFormVisible.set(false);
        this.shouldRenderForm = false;
        this.correspondentId.set(0);
      });
  }
}
