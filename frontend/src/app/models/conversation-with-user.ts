import { Conversation, User } from ".";

export interface ConversationWithUser {
  conversation: Conversation[];
  corenspondent: User;
}
