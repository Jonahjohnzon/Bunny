import ForumApi from '../ApiCore';

const api = new ForumApi();

export interface Thread {
  _id: string;
  title: string;
  subforum: string;
  image?: string;
  author: { username: string; avatar: string };
  isPinned: boolean;
  isLocked: boolean;
  replyCount: number;
  views: number;
  createdAt: string;
  prefix: string;
}

export interface Data {
  data: Thread;
  success: boolean;
}

export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
}

export interface PaginatedThreads {
  threads: Thread[];
  total: number;
  page: number;
  pages: number;
}

export interface ThreadUpdateBody {
  title?:   string;
  content?: string;
  image?:   string;
  tags?:    string[];
  prefix?:  string;
}

export const ThreadService = {
  list: (subforumId: string, page = 1) =>
    api.get<ApiResponse<PaginatedThreads>>(`/subforums/${subforumId}/threads`, { page }),

  getById: (threadId: string) =>
    api.get<ApiResponse<Thread & { content: string; tags: string[]; prefix: string }>>(`/threads/${threadId}`),

  // keep old name as alias so existing callers don't break
  get: (threadId: string) =>
    api.get<Data>(`/threads/${threadId}`),

  create: (body: {
    title:      string;
    content:    string;
    image?:     string;
    subforumId: string;
    categoryId?: string;
    prefix?:    string;
    tags:       string[];
  }) => api.post<Data>('/threads/new', body),

  update: (threadId: string, body: ThreadUpdateBody) =>
    api.patch<ApiResponse<Thread>>(`/threads/${threadId}`, body),

  delete: (threadId: string) =>
    api.delete<ApiResponse<{ deleted: boolean }>>(`/threads/${threadId}`),

  lock: (threadId: string) =>
    api.patch<ApiResponse<Thread>>(`/threads/${threadId}/lock`),

  pin: (threadId: string) =>
    api.patch<ApiResponse<Thread>>(`/threads/${threadId}/pin`),
};