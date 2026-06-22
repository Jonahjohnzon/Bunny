import { Notification } from './types';

export const mockNotifications: Notification[] = [
  {
    _id: '1',
    type: 'reply',
    read: false,
    actor: { _id: 'u1', username: 'rustacean', avatar: 'R' },
    thread: { _id: 't1', title: 'Next.js 15 App Router patterns' },
    post: { _id: 'p1' },
    createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(), // 4m ago
  },
  {
    _id: '2',
    type: 'reaction',
    read: false,
    actor: { _id: 'u2', username: 'cinephile', avatar: 'C' },
    thread: { _id: 't2', title: 'Best practices for HLS streaming proxies' },
    post: { _id: 'p2' },
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18m ago
  },
  {
    _id: '3',
    type: 'mention',
    read: false,
    actor: { _id: 'u3', username: 'techguru', avatar: 'T' },
    thread: { _id: 't3', title: 'MongoDB schema design for forums' },
    post: { _id: 'p3' },
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45m ago
  },
  {
    _id: '4',
    type: 'quote',
    read: false,
    actor: { _id: 'u4', username: 'pcmasterrace', avatar: 'P' },
    thread: { _id: 't4', title: 'RTX 5090 benchmark thread' },
    post: { _id: 'p4' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2h ago
  },
  {
    _id: '5',
    type: 'dm',
    read: true,
    actor: { _id: 'u5', username: 'newuser99', avatar: 'N' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5h ago
  },
  {
    _id: '6',
    type: 'warning',
    read: true,
    actor: { _id: 'u6', username: 'Admin', avatar: 'A' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1d ago
  },
  {
    _id: '7',
    type: 'reply',
    read: true,
    actor: { _id: 'u7', username: 'mobileking', avatar: 'M' },
    thread: { _id: 't5', title: 'Dragons in modern settings — YouTube video ideas' },
    post: { _id: 'p5' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 1d ago
  },
  {
    _id: '8',
    type: 'reaction',
    read: true,
    actor: { _id: 'u8', username: 'chatterbox', avatar: 'C' },
    thread: { _id: 't6', title: 'What are you listening to right now?' },
    post: { _id: 'p6' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2d ago
  },
];