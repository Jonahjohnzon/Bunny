// app/services/forum.ts
import ForumApi from '../ApiCore';

const api = new ForumApi();

export const ForumService = {
  getStats: () => api.get('/forum/stats'),
};