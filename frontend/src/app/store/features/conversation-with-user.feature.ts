import {
  signalStoreFeature,
  withState,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { ConversationWithUser } from '../../models';

export const ConversationWithUserFeature = signalStoreFeature(
  withState<{ ConversationWithUser: { [key: number]: ConversationWithUser } }>({
    ConversationWithUser: {}, // Initialize as an empty object
  }),
  withMethods((store) => ({
    setConversationWithUser: (userId: number, conversation: ConversationWithUser) =>
      patchState(store, {
        ConversationWithUser: {
          ...store.ConversationWithUser(),
          [userId]: conversation, // Add or update the conversation for the given userId
        },
      }),
    getConversationWithUser: (userId: number) => store.ConversationWithUser()[userId], // Retrieve conversation by userId
    getAllConversationsWithUsers: () => store.ConversationWithUser(), // Retrieve all conversations
  }))
);
