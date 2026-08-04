/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import mongoosedb from "@/app/lib/db/db";
import Post from "@/app/lib/models/Post";
import Thread from "@/app/lib/models/ThreadSchema";
import { ok, fail, serverError } from "@/app/lib/response";
import Reaction from "@/app/lib/models/Reaction";
const PAGE_SIZE = 10;
import { withOptionalAuth  } from "@/app/lib/middleware/auth";
import User from "@/app/lib/models/User";
import '@/app/lib/models/Badge'
import { attachAuthorBadges } from "@/app/lib/helpers/attachAuthorBadges";
import { cached, threadPostsCacheKey } from "@/app/lib/cache";

// Shared populate config so the top-level and replies queries can't drift
// out of sync with each other.
// wherever AUTHOR_POPULATE is defined — likely services/postService.ts or a shared constants file
const AUTHOR_POPULATE = {
  path: 'author',
  select: 'username avatar customTitle role badges postCount avatarEffect usernameEffect ', // add `badges` to select
  populate: [
    { path: 'role', select: 'name color permissions' },
  ],
};

// Everything here is public (post content, author info, badges) — safe to
// cache and share across every viewer of this page. Per-user state
// (myReaction) is deliberately NOT computed here; it's merged in live after
// the cache lookup below, so one user's reactions never leak into another
// user's cached response.
async function fetchPostsPageData(id: string, page: number) {
  await mongoosedb();

  const topLevelFilter = { thread: id, parentPost: null, isDeleted: false };

  const [topLevel, total] = await Promise.all([
    Post.find(topLevelFilter)
      .sort({ isFirstPost: -1, createdAt: 1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .populate(AUTHOR_POPULATE)
      .lean(),
    Post.countDocuments(topLevelFilter),
  ]);

  const topLevelIds = topLevel.map((p) => p._id);

  const replies = topLevelIds.length
    ? await Post.find({
        thread: id,
        isDeleted: false,
        rootPost: { $in: topLevelIds },
      })
        .sort({ createdAt: 1 })
        .populate(AUTHOR_POPULATE)
        .lean()
    : [];

  const allPosts = [...topLevel, ...replies];
  const postsWithBadges = await attachAuthorBadges(allPosts);

  return {
    posts: postsWithBadges,
    page,
    pageSize: PAGE_SIZE,
    total,
    hasMore: page * PAGE_SIZE < total,
  };
}

// GET /api/threads/[id]/posts?page=1
// Returns page N of top-level posts (10/page), plus every nested reply
// underneath that page's posts, so the client can build the full tree.
//
// Cached per thread+page via the shared "thread" version (bumped wherever
// posts are created/edited/deleted, and by thread edits/votes). The
// per-user reaction overlay is always fetched live, on top of the cache.
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withOptionalAuth(req, async (user) => {
    try {
      await mongoosedb();
      let full;
      if (user)
      {
      full = await User.findById(user._id);
      }

      const { id } = await params;
      if (!id) {
        return serverError("GET /api/threads/[id]/posts");
      }
      const { searchParams } = new URL(req.url);
      const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

      const thread = await Thread.findById(id).select("isDeleted");
      if (!thread || thread.isDeleted) return fail("Thread not found.", 404);

      const keyParts = await threadPostsCacheKey(id, page);
      const base = await cached(keyParts, () => fetchPostsPageData(id, page));

      // Merge in this user's own reaction per post — always live, never cached.
      let reactionsByPost: Record<string, string> = {};
      if (full && base.posts.length) {
        const postIds = base.posts.map((p: any) => p._id);
        const myReactions = await Reaction.find({
          post: { $in: postIds },
          user: full._id,
        })
          .select("post type")
          .lean();

        reactionsByPost = Object.fromEntries(
          myReactions.map((r) => [r.post.toString(), r.type])
        );
      }

      const postsWithMyReaction = base.posts.map((p: any) => ({
        ...p,
        myReaction: reactionsByPost[p._id.toString()] ?? null,
      }));

      return ok({
        ...base,
        posts: postsWithMyReaction,
      });
    } catch (err) {
      return serverError(err, "GET /api/threads/[id]/posts");
    }
  });
}