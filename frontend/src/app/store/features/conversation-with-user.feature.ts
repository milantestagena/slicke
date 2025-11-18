import {
  signalStoreFeature,
  withState,
  withMethods,
  withHooks,
  patchState,
} from '@ngrx/signals';
import { inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService } from '../../services/message.service';
import { ConversationWithUser } from '../../models';
import { catchError, finalize, map, of, take, tap } from 'rxjs';

interface ConversationWithUserState {
  ConversationWithUser: { [key: number]: ConversationWithUser };
  loading: boolean;
  error: string | null;
}

const defaultConversationWithUserState = (): ConversationWithUserState => ({
  ConversationWithUser: {},
  loading: false,
  error: null,
});

let messageService: MessageService;
let destroyRef: DestroyRef;

export const ConversationWithUserFeature = signalStoreFeature(
  withState<ConversationWithUserState>(defaultConversationWithUserState()),

  withHooks(() => ({
    onInit() {
      messageService = inject(MessageService);
      destroyRef = inject(DestroyRef);
    },
  })),

  withMethods((store) => {
    const resetState = () =>
      patchState(store, defaultConversationWithUserState());
    const reloadConversation = (correspondentId: number) => {
      patchState(store, { loading: true, error: null });

      messageService
        .getConversationWithUser(correspondentId)
        .pipe(
          take(1),
          map((r: any) => r?.data as ConversationWithUser),
          catchError(() => {
            patchState(store, { error: 'Failed to load conversation' });
            return of<ConversationWithUser | null>(null);
          }),
          finalize(() => patchState(store, { loading: false })),
          takeUntilDestroyed(destroyRef)
        )
        .subscribe((conv) => {
          if (conv) {
            patchState(store, {
              ConversationWithUser: {
                ...store.ConversationWithUser(),
                [correspondentId]: conv,
              },
            });
          }
        });
    };

    return {
      setConversationWithUser(
        userId: number,
        conversation: ConversationWithUser
      ) {
        patchState(store, {
          ConversationWithUser: {
            ...store.ConversationWithUser(),
            [userId]: conversation,
          },
        });
      },

      getConversationWithUser(userId: number) {
        return store.ConversationWithUser()[userId];
      },

      getAllConversationsWithUsers() {
        return store.ConversationWithUser();
      },

      // bivši loadConversationWithUser
      loadConversationWithUser: reloadConversation,

      sendMessageToUsername(
        recipientName: string,
        message: string,
        refreshUserId?: number
      ) {
        messageService
          .sendMessage(message, recipientName)
          .pipe(
            take(1),
            tap(() => {
              if (typeof refreshUserId === 'number') {
                // umesto store.loadConversationWithUser(...) zovi lokalni helper
                reloadConversation(refreshUserId);
              }
            }),
            catchError(() => of(null)),
            takeUntilDestroyed(destroyRef)
          )
          .subscribe();
      },

      resetConversationWithUser: resetState,
    };
  })
);
