"use server";
import mongoosedb from "@/app/lib/db/db";
import User from "@/app/lib/models/User";
import Thread from "@/app/lib/models/ThreadSchema";
import Post from "@/app/lib/models/Post";
import { ok, serverError } from "../../../lib/response";

const ONLINE_WINDOW_MS   = 30 * 60 * 1000;       // 30 minutes
const TRENDING_WINDOW_MS = 48 * 60 * 60 * 1000;  // 48 hours
const ONLINE_PREVIEW_LIMIT = 6;
const TRENDING_LIMIT       = 4;

// ─── safe wrappers — never throw, always return a fallback ───────────────────

async function getTotalThreads(): Promise<number> {
  try {
    return await Thread.countDocuments({ isDeleted: false });
  } catch {
    return 0;
  }
}

async function getTotalPosts(): Promise<number> {
  try {
    return await Post.countDocuments({ isDeleted: false });
  } catch {
    return 0;
  }
}

async function getTotalMembers(): Promise<number> {
  try {
    return await User.countDocuments();
  } catch {
    return 0;
  }
}

async function getNewestMember(): Promise<string | null> {
  try {
    const user = await User.findOne().sort({ createdAt: -1 }).select("username").lean();
    return user?.username ?? null;
  } catch {
    return null;
  }
}

async function getOnlineUsers(since: Date): Promise<{ username: string; usernameEffect: string | null }[]> {
  try {
    const users = await User.find({ lastSeenAt: { $gte: since } })
      .populate({
        path: "role",
        select: "name usernameEffect",
        match: { name: { $in: ["Admin", "Mod"] } },
        options: { strictPopulate: false },
      })
      .sort({ lastSeenAt: -1 })
      .limit(ONLINE_PREVIEW_LIMIT)
      .select("username role usernameEffect")
      .lean();

    return users
      .filter((u) => u.role)
      .map((u) => ({
        username: u.username,
        usernameEffect: u?.usernameEffect ?? null,
      }));
  } catch {
    return [];
  }
}

async function getTrendingThreads(since: Date) {
  try {
    const agg = await Post.aggregate([
      { $match: { createdAt: { $gte: since }, isDeleted: false } },
      { $group: { _id: "$thread", activityCount: { $sum: 1 } } },
      { $sort: { activityCount: -1 } },
      { $limit: TRENDING_LIMIT },
    ]);

    if (!agg.length) return [];

    const threadIds = agg.map((t) => t._id);
    const threadDocs = await Thread.find({ _id: { $in: threadIds }, isDeleted: false })
      .select("title subforum")
      .lean();

    const threadMap = new Map(threadDocs.map((t) => [t._id.toString(), t]));

    return agg
      .map((t) => {
        const thread = threadMap.get(t._id.toString());
        if (!thread) return null;
        return {
          _id:           thread._id,
          title:         thread.title,
          subforum:      thread.subforum,
          activityCount: t.activityCount,
        };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

// ─── route handler ────────────────────────────────────────────────────────────

export async function GET() {
  try {
    await mongoosedb();
  } catch (err) {
    return serverError(err, "GET /api/forum/stats — db connection");
  }

  const onlineSince   = new Date(Date.now() - ONLINE_WINDOW_MS);
  const trendingSince = new Date(Date.now() - TRENDING_WINDOW_MS);

  // Run all queries independently — one failing won't affect the others
  const [
    totalThreads,
    totalPosts,
    totalMembers,
    newestMember,
    onlineUsers,
    trendingThreads,
  ] = await Promise.all([
    getTotalThreads(),
    getTotalPosts(),
    getTotalMembers(),
    getNewestMember(),
    getOnlineUsers(onlineSince),
    getTrendingThreads(trendingSince),
  ]);

  return ok({
    stats: {
      totalThreads,
      totalPosts,
      totalMembers,
      newestMember,
    },
    onlineUsers: {
      users: onlineUsers,
      total: onlineUsers.length,
    },
    trendingThreads,
  });
}