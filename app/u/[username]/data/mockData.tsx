import { UserProfile, RecentPost, Theme } from '../types';
import { Shield, Award, MessageSquare } from 'lucide-react';

export const mockProfile: UserProfile = {
  username: 'jonah_dev',
  customTitle: 'Senior Member',
  role: { name: 'Moderator', color: '#4b8ef1' },
  avatar: 'J',
  banner: '',
  bio: 'Full-stack developer building ScreenOpps — a video streaming platform. Into Next.js, Node.js, and everything web. Also into fantasy/sci-fi content creation.',
  signature: 'Building things on the internet. 🚀',
  location: 'Jos, Nigeria',
  website: 'https://screenopps.com',
  socials: { link: 'jonahdev', website: 'jonahjohnzon' },
  postCount: 1204,
  threadCount: 88,
  reputation: 342,
  joinedAt: 'March 2022',
  lastSeenAt: 'Just now',
  isOnline: true,
  isOwnProfile: true,
};

export const mockRecentPosts: RecentPost[] = [
  {
    id: '1',
    threadTitle: 'Next.js 15 App Router patterns',
    subforum: 'Web Development',
    excerpt: 'The new caching model is a game changer once you get past the learning curve...',
    timeAgo: '1h ago',
    replyCount: 14,
  },
  {
    id: '2',
    threadTitle: 'Best practices for HLS streaming proxies',
    subforum: 'Programming',
    excerpt: 'If you want to avoid 502s from Cloudflare datacenter IPs blocking upstream CDNs...',
    timeAgo: '3h ago',
    replyCount: 7,
  },
  {
    id: '3',
    threadTitle: 'MongoDB schema design for forums',
    subforum: 'Programming',
    excerpt: 'The Category → Subforum → Thread → Post hierarchy works well with Mongoose refs...',
    timeAgo: '1d ago',
    replyCount: 22,
  },
  {
    id: '4',
    threadTitle: 'Dragons in modern settings — YouTube video ideas',
    subforum: 'Off Topic',
    excerpt: 'Working on a fantasy/sci-fi channel and want to explore how dragons would interact...',
    timeAgo: '2d ago',
    replyCount: 5,
  },
];

export const mockBadges = [
  { icon: Shield, label: 'Moderator', color: '#4b8ef1' },
  { icon: Award, label: 'Top Poster', color: '#f59e0b' },
  { icon: MessageSquare, label: '1000 Posts', color: '#10b981' },
];

export const mockActivityStats = [
  { label: 'Posts per day', value: '3.2' },
  { label: 'Likes received', value: '342' },
  { label: 'Likes given', value: '218' },
  { label: 'Trophy points', value: '85' },
];

export const themes: Theme[] = [
  { id: 'dark-default', name: 'Dark',     bg: '#1b1c1f', accent: '#4b8ef1' },
  { id: 'midnight',     name: 'Midnight', bg: '#0d1117', accent: '#58a6ff' },
  { id: 'slate',        name: 'Slate',    bg: '#0f172a', accent: '#8b5cf6' },
  { id: 'forest',       name: 'Forest',   bg: '#0d1f17', accent: '#10b981' },
  { id: 'crimson',      name: 'Crimson',  bg: '#1a0f0f', accent: '#ef4444' },
  { id: 'light',        name: 'Light',    bg: '#f4f4f5', accent: '#4b8ef1' },
];