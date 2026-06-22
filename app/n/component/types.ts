export type NotificationType = 'reply' | 'quote' | 'reaction' | 'mention' | 'warning' | 'dm';

export interface Actor {
  _id: string;
  username: string;
  avatar: string; // single letter for now
}

export interface Notification {
  _id: string;
  type: NotificationType;
  read: boolean;
  actor: Actor;
  thread?: { _id: string; title: string };
  post?: { _id: string };
  createdAt: string;
  message:string;
}