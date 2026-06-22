// app/messages/types.ts
export interface MessageUser { _id: string; username: string; avatar?: string | null; }
export interface DMMessage { _id: string; sender: MessageUser | string; content: string; createdAt: string; readAt: string | null; }
export interface ConversationPreview {
  _id: string;
  otherUser: MessageUser | null;
  lastMessage: { content: string; sender: string; createdAt: string } | null;
  unread: boolean;
  lastMessageAt: string;
}
export interface Conversation { _id: string; participants: MessageUser[]; messages: DMMessage[]; lastMessageAt: string; }