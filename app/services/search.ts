// app/services/search.ts
import ForumApi from '../ApiCore';

const api = new ForumApi();

export interface SearchParams {
  q?: string;
  type?: 'all' | 'threads' | 'posts';
  page?: number;
  // advanced
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

function toQuery(params: SearchParams): string {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '' && v !== null) p.set(k, String(v));
  });
  return p.toString();
}

export const SearchService = {
  search: (params: SearchParams) => api.get(`/search?${toQuery(params)}`),
};