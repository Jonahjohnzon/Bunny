// services/messages.ts
import ForumApi from '../ApiCore';
const api = new ForumApi();

export const MessageService = {
  listConversations: () => api.get('/messages'),
  getConversation: (id: string) => api.get(`/messages/${id}`),
  send: (data: { recipientId?: string; conversationId?: string; content: string }) => api.post('/messages', data),
  deleteConversation: (id: string) => api.delete(`/messages/${id}`),
  deleteMessage: (conversationId: string, messageId: string) => api.delete(`/messages/${conversationId}/messages/${messageId}`),
  unreadCount: () => api.get('/messages/unread-count'),
};