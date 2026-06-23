"use server";

import mongoosedb from "@/app/lib/db/db";
import User from "@/app/lib/models/User";
import Post from "@/app/lib/models/Post";
import { withOptionalAuth } from "@/app/lib/middleware/auth";
import { ok, fail, serverError, getPagination } from "@/app/lib/response";
import '@/app/lib/models/ThreadSchema'
import '@/app/lib/models/SubforumSchema'

// GET /api/users/[username]/posts — paginated post history
export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  return withOptionalAuth(req, async () => {
    try {
      await mongoosedb();
      const { username } = await params;
      const { searchParams } = new URL(req.url);
      const { page, limit } = getPagination(searchParams, 10);
     
      const user = await User.findOne({ username }).select("_id").lean();
       
      if (!user) return fail("User not found.", 404);

      const [posts, total] = await Promise.all([
        Post.find({ author: user._id, isDeleted: false })
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .populate({
            path: "thread",
            select: "title subforum",
            populate: { path: "subforum", select: "name slug" },
          })
          .select("content thread createdAt reactionCount")
          .lean(),
        Post.countDocuments({ author: user._id, isDeleted: false }),
      ]);

      return ok({
        items: posts.map(formatPost),
        total,
        page,
        pages: Math.ceil(total / limit),
      });
    } catch (err) {
      return serverError(err, "GET /api/users/[username]/posts");
    }
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatPost(post: any) {
  return {
    id: post._id.toString(),
    threadId: post.thread?._id?.toString() ?? null,
    subforum: post.thread?.subforum?.name ?? "General",
    threadTitle: post.thread?.title ?? "[deleted thread]",
    excerpt: makeExcerpt(post.content),
    reactionCount: post.reactionCount ?? 0,
    timeAgo: post.createdAt
  };
}

function makeExcerpt(content: string, maxLength = 160): string {
  const stripped = content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  return stripped.length > maxLength
    ? stripped.slice(0, maxLength).trimEnd() + "…"
    : stripped;
}

