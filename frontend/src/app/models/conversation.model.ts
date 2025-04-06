export interface Conversation {
  id: number;
  sender_id: number,
  receiver_id: number,
  message: string,
  sender_name: string,
  receiver_name: string,
  created_at: string,
}
