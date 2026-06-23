import ForumApi from '../ApiCore';
import { Thread } from '../MainPage/types/forum';

const api = new ForumApi();



export interface t {
  thread:Thread
}

export interface Data {
  data: t;
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

  getById: (threadId: string | undefined) =>
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

  update: (threadId: string | undefined, body: ThreadUpdateBody) =>
    api.patch<ApiResponse<Thread>>(`/threads/${threadId}`, body),

  delete: (threadId: string | undefined) =>
    api.delete<ApiResponse<{ deleted: boolean }>>(`/threads/${threadId}`),

  lock: (threadId: string | undefined) =>
    api.patch<ApiResponse<Thread>>(`/threads/${threadId}/lock`),

  pin: (threadId: string | undefined) =>
    api.patch<ApiResponse<Thread>>(`/threads/${threadId}/pin`),
};