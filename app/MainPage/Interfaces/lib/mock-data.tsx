import {
  Megaphone, Code, Globe, Gamepad2,
} from 'lucide-react';
import { Category, ForumStats } from '../../types/forum';

export const categories: Category[] = [
  {
    id: 'announcements',
    name: 'Community',
    icon: <Megaphone size={16} />,
    accentColor: '#f59e0b',
    subforums: [
      {
        id: 'announcements',
        name: 'Announcements',
        description: 'Official news and updates from the staff team.',
        threadCount: 42,
        postCount: 318,
        isReadOnly: true,
        lastPost: {
          username: 'Admin',
          avatar: 'A',
          timeAgo: '2h ago',
          threadTitle: 'Forum rules updated for 2025',
        },
      },
      {
        id: 'introductions',
        name: 'Introductions',
        description: 'New here? Say hello and introduce yourself to the community.',
        threadCount: 1204,
        postCount: 8943,
        isNew: true,
        lastPost: {
          username: 'newuser99',
          avatar: 'N',
          timeAgo: '12m ago',
          threadTitle: 'Hey everyone, just joined!',
        },
      },
    ],
  },
  {
    id: 'tech',
    name: 'Technology',
    icon: <Code size={16} />,
    accentColor: '#4b8ef1',
    subforums: [
      {
        id: 'programming',
        name: 'Programming',
        description: 'Discuss languages, frameworks, open source projects and dev tools.',
        threadCount: 5820,
        postCount: 48201,
        lastPost: {
          username: 'rustacean',
          avatar: 'R',
          timeAgo: '4m ago',
          threadTitle: 'Why Rust is taking over systems programming',
        },
      },
      {
        id: 'webdev',
        name: 'Web Development',
        description: 'Frontend, backend, full-stack, DevOps — all things web.',
        threadCount: 3102,
        postCount: 29110,
        lastPost: {
          username: 'jonah_dev',
          avatar: 'J',
          timeAgo: '1h ago',
          threadTitle: 'Next.js 15 App Router patterns',
        },
      },
      {
        id: 'hardware',
        name: 'Hardware & Devices',
        description: 'CPUs, GPUs, peripherals, builds, and everything physical.',
        threadCount: 2041,
        postCount: 17830,
        lastPost: {
          username: 'techguru',
          avatar: 'T',
          timeAgo: '3h ago',
          threadTitle: 'RTX 5090 benchmark thread',
        },
      },
    ],
  },
  {
    id: 'general',
    name: 'General',
    icon: <Globe size={16} />,
    accentColor: '#10b981',
    subforums: [
      {
        id: 'offtopic',
        name: 'Off Topic',
        description: "Anything and everything that doesn't fit elsewhere.",
        threadCount: 9201,
        postCount: 102840,
        lastPost: {
          username: 'chatterbox',
          avatar: 'C',
          timeAgo: '2m ago',
          threadTitle: 'What are you listening to right now?',
        },
      },
      {
        id: 'media',
        name: 'Movies & TV',
        description: 'Reviews, recommendations, and discussions on films and series.',
        threadCount: 4102,
        postCount: 38291,
        lastPost: {
          username: 'cinephile',
          avatar: 'C',
          timeAgo: '45m ago',
          threadTitle: 'Severance S2 episode discussion',
        },
      },
    ],
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: <Gamepad2 size={16} />,
    accentColor: '#8b5cf6',
    subforums: [
      {
        id: 'pc-gaming',
        name: 'PC Gaming',
        description: 'PC game recommendations, builds, mods, and gaming news.',
        threadCount: 6720,
        postCount: 59204,
        lastPost: {
          username: 'pcmasterrace',
          avatar: 'P',
          timeAgo: '8m ago',
          threadTitle: 'Elden Ring DLC tier list — share yours',
        },
      },
      {
        id: 'mobile-gaming',
        name: 'Mobile Gaming',
        description: 'iOS and Android games, tips, and community events.',
        threadCount: 1830,
        postCount: 14020,
        lastPost: {
          username: 'mobileking',
          avatar: 'M',
          timeAgo: '2h ago',
          threadTitle: 'Best gacha games with no pay wall',
        },
      },
    ],
  },
];

export const stats: ForumStats = {
  totalThreads: 28261,
  totalPosts: 318761,
  totalMembers: 14820,
  newestMember: 'xXdarkwolfXx',
};

export const trendingThreads: string[] = [
  'Next.js 15 App Router patterns',
  'RTX 5090 benchmark thread',
  'Elden Ring DLC tier list',
  'Why Rust is taking over',
];

export const onlineUsers: string[] = [
  'jonah_dev', 'rustacean', 'cinephile', 'pcmasterrace', 'techguru',
];