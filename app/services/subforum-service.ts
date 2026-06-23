import ForumApi from '../ApiCore';
import type { ApiResponse } from './category-service';
import { Thread } from '../MainPage/types/forum';
const api = new ForumApi();

// ── Types ─────────────────────────────────────────────────────────────────────
export interface ApiSubforumFull {
  _id: string;
  name: string;
  description: string;
  category: string;
  parent: string | null;
  leadsToThreads: boolean;
  order: number;
  icon: string | null;
  isPrivate: boolean;
  accentColor:string;
  isReadOnly: boolean;
  allowedRoles: { _id: string; name: string; color: string }[];
  threadCount: number;
  postCount: number;
  lastPost: {
    thread: { _id: string; title: string } | null;
    user:   { username: string; avatar: string } | null;
    createdAt: string | null;
  };
  children: ApiSubforumFull[];
}

export interface SubforumInput {
  name: string;
  description?: string;
  categoryId: string;
  parentId?: string | null;
  leadsToThreads?: boolean;
  order?: number;
  icon?: string | null;
  isPrivate?: boolean;
  isReadOnly?: boolean;
  allowedRoles?: string[];
}

export interface SubforumPageResult {
  subforum: ApiSubforumFull;
  type: 'threads' | 'subforums';
  // type=threads
  items?: Thread[] | ApiSubforumFull[];
  total?: number;
  page?: number;
  pages?: number;
  // type=subforums
  children?: ApiSubforumFull[];
}

// ── Service ───────────────────────────────────────────────────────────────────
export const SubforumService = {

  // Get single subforum — returns threads or child subforums depending on leadsToThreads
  get: (id: string, page = 1) =>
    api.get<ApiResponse<SubforumPageResult>>(`/subforums/${id}`, { page }),

  // Create subforum (top-level or nested)
  create: (input: SubforumInput) =>
    api.post<ApiResponse<ApiSubforumFull>>('/subforums', input),

  // Update subforum fields
  update: (id: string, input: Partial<SubforumInput>) =>
    api.patch<ApiResponse<ApiSubforumFull>>(`/subforums/${id}`, input),

  // Delete subforum (and all descendants)
  delete: (id: string) =>
    api.delete<ApiResponse<{ deleted: boolean }>>(`/subforums/${id}`),

  // Reorder: swap order between two subforums
  reorder: (idA: string, orderA: number, idB: string, orderB: number) =>
    Promise.all([
      api.patch(`/subforums/${idA}`, { order: orderB }),
      api.patch(`/subforums/${idB}`, { order: orderA }),
    ]),
};