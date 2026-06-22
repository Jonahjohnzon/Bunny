// services/activityService.ts
import UserModel from "@/app/lib/models/User";
import ThreadModel from "@/app/lib/models/ThreadSchema";
import PostModel from "@/app/lib/models/Post";

export async function getUserActivityStats(userId: string) {
  const user = await UserModel.findById(userId)
    .select('reputation createdAt lastSeenAt')
    .lean();

  if (!user) return [];

  const [postCount, threadCount] = await Promise.all([
    PostModel.countDocuments({ author: userId, isDeleted: false }),
    ThreadModel.countDocuments({ author: userId, isDeleted: false }),
  ]);

  return [
    { label: 'Posts',       value: postCount.toLocaleString() },
    { label: 'Threads',     value: threadCount.toLocaleString() },
    { label: 'Reputation',  value: user.reputation.toLocaleString() },
    { label: 'Joined',      value: formatJoinDate(user.createdAt) },
    { label: 'Last seen',   value: formatRelativeTime(user.lastSeenAt) },
  ];
}

function formatJoinDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function formatRelativeTime(date: Date) {
  const diffMins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}