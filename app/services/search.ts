// app/services/search.ts
import ForumApi from '../ApiCore';

const api = new ForumApi();

export interface SearchParams {
  q?: string;
  type?: 'all' | 'threads' | 'posts';
  page?: number;
  author?: string;
  subforum?: string;
  tag?: string;
  prefix?: string;
  dateFrom?: string;
  dateTo?: string;
  minReplies?: number;
  minViews?: number;
  sortBy?: 'relevance' | 'newest' | 'oldest' | 'mostReplies' | 'mostViews';
  titleOnly?: boolean;
}

export interface SearchResultThread {
  _id: string;
  title: string;
  author: { _id: string; username: string; avatar?: string };
  subforum?: { _id: string; name: string };
  replyCount?: number;
  views?: number;
  createdAt: string;
  tags?: string[];
  prefix?: string;
  isPinned?: boolean;
  isLocked?: boolean;
}

export interface SearchResultPost {
  _id: string;
  content: string;
  author: { _id: string; username: string; avatar?: string };
  thread: { _id: string; title: string };
  subforum?: { _id: string; name: string };
  createdAt: string;
}

interface ThreadResult {
  _id: string;
  _resultType: 'thread';
  title: string;
  author: { _id: string; username: string; avatar?: string };
  subforum: { name: string; slug: string; _id:string };
  replyCount: number;
  views: number;
  tags: string[];
  prefix?: string;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: Date;
}

interface PostResult {
  _id: string;
  _resultType: 'post';
  content: string;
  author: { _id: string; username: string; avatar?: string };
  thread: { _id: string; title: string; subforum: { name: string; slug: string; _id:string } };
  createdAt: Date;
}

export type SearchResult = ThreadResult | PostResult;;

export interface SearchResponse {
  success: boolean;
  data: {
    results: SearchResult[];
    total: number;
    pages: number;
    page: number;
  };
}

function toQuery(params: SearchParams): string {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '' && v !== null) p.set(k, String(v));
  });
  return p.toString();
}

export const SearchService = {
  search: (params: SearchParams) =>
    api.get<SearchResponse>(`/search?${toQuery(params)}`),
};