export interface UserRole {
  name: string;
  color: string;
}

export interface RecentThread {
  id: string;
  subforum: string;
  threadTitle: string;
  excerpt: string;
  replyCount: number;
  views: number;
  timeAgo: string;
}

export interface UserProfile {
  username: string;
  customTitle: string;
  role: UserRole;
  avatar: string;
  email: string;       // single letter for now, replace with image url
  banner: string;
  bio: string;
  signature: string;
  location: string;
  socials: {
    website: string;
    link: string;
  };
  postCount: number;
  threadCount: number;
  reputation: number;
  joinedAt: Date;
  lastSeenAt: Date;
  isOnline: boolean;
  isOwnProfile: boolean;
  createdAt:Date;
}

export interface RecentPost {
  id: string;
  threadTitle: string;
  subforum: string;
  excerpt: string;
  timeAgo: string;
  replyCount: number;
}

export interface Badge {
  icon: React.ReactNode;
  label: string;
  color: string;
}

export interface ActivityStat {
  label: string;
  value: string;
}

export type EditTab = 'profile' | 'account' | 'appearance' | 'notifications';
export type ProfileTab = 'posts' | 'about';

export interface Theme {
  id: string;
  name: string;
  bg: string;
  accent: string;
}