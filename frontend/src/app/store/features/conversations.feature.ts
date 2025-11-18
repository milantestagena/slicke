import {
  signalStoreFeature,
  withState,
  withMethods,
  withHooks,
  patchState,
} from '@ngrx/signals';
import { inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Conversation } from '../../models';
import { MessageService } from '../../services/message.service';
import { catchError, finalize, map, of, take } from 'rxjs';

interface ConversationsState {
  Conversations: Conversation[];
  conversationsLoading: boolean;
  conversationsError: string | null;
}

const defaultConversationsState = (): ConversationsState => ({
  Conversations: [],
  conversationsLoading: false,
  conversationsError: null,
});

let messageService: MessageService;
let destroyRef: DestroyRef;

export const ConversationsFeature = signalStoreFeature(
  withState<ConversationsState>(defaultConversationsState()),

  withHooks(() => ({
    onInit() {
      messageService = inject(MessageService);
      destroyRef = inject(DestroyRef);
    },
  })),

  withMethods((store) => {
    const resetState = () => patchState(store, defaultConversationsState());

    return {
      setConversations(conversations: Conversation[]) {
        patchState(store, { Conversations: conversations });
      },

    getConversations() {
      return [...store.Conversations()];
    },

      loadConversations() {
        patchState(store, {
          conversationsLoading: true,
          conversationsError: null,
        });

      messageService
        .getConversations()
        .pipe(
          take(1),
          map((r: any) => (r?.data as Conversation[]) ?? []),
          catchError(() => {
            patchState(store, {
              conversationsError: 'Failed to load conversations',
            });
            return of<Conversation[]>([]);
          }),
          finalize(() =>
            patchState(store, { conversationsLoading: false })
          ),
          takeUntilDestroyed(destroyRef)
        )
        .subscribe((list) => {
          patchState(store, { Conversations: list });
        });
    },

      resetConversations: resetState,
    };
  })
);
