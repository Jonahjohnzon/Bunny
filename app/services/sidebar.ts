// services/posts.ts
import ForumApi from '../ApiCore';

const api = new ForumApi();

interface ProfileSidebarResponse {
  badges: {
    id: string; key: string; label: string; description: string;
    icon: string; color: string; tier: string; awardedAt: string;
  }[];
  activity: { label: string; value: string }[];
}

export const sideService = {
  // Page 1 = first 20 top-level posts + all their nested replies
  list: (username: string) =>
    api.get<ProfileSidebarResponse>(`/users/${username}/sidebar`),

  
};