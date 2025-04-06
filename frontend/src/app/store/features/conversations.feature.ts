import {
  signalStoreFeature,
  withState,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { Conversation } from '../../models';

export const ConversationsFeature = signalStoreFeature(
  withState<{ Conversations: Conversation[] }>({ Conversations: [] }),
  withMethods((store) => ({
    setConversations: (conversations: Conversation[]) =>
      patchState(store, { Conversations: conversations }),
    getConversations: () => [...store.Conversations()],
  }))
);
