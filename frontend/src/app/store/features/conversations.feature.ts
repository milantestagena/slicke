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
  loading: boolean;
  error: string | null;
}

let messageService: MessageService;
let destroyRef: DestroyRef;

export const ConversationsFeature = signalStoreFeature(
  withState<ConversationsState>({
    Conversations: [],
    loading: false,
    error: null,
  }),

  withHooks(() => ({
    onInit() {
      messageService = inject(MessageService);
      destroyRef = inject(DestroyRef);
    },
  })),

  withMethods((store) => ({
    setConversations(conversations: Conversation[]) {
      patchState(store, { Conversations: conversations });
    },

    getConversations() {
      return [...store.Conversations()];
    },

    loadConversations() {
      patchState(store, { loading: true, error: null });

      messageService
        .getConversations()
        .pipe(
          take(1),
          map((r: any) => (r?.data as Conversation[]) ?? []),
          catchError(() => {
            patchState(store, { error: 'Failed to load conversations' });
            return of<Conversation[]>([]);
          }),
          finalize(() => patchState(store, { loading: false })),
          takeUntilDestroyed(destroyRef)
        )
        .subscribe((list) => {
          patchState(store, { Conversations: list });
        });
    },
  }))
);
