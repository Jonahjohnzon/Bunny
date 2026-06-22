"use server";

import mongoosedb from "@/app/lib/db/db";
import User from "@/app/lib/models/User";
import Post from "@/app/lib/models/Post";
import { withAuth, withOptionalAuth } from "../../lib/middleware/auth";
import { ok, fail, serverError, getPagination } from "../../lib/response";

// GET /api/users/[username] — public profile
export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  return withOptionalAuth(req, async (viewer) => {
    try {
      await mongoosedb();
      const { searchParams } = new URL(req.url);
      const { page, limit } = getPagination(searchParams, 10);

      const user = await User.findOne({ username: params.username })
        .populate("role", "name color permissions")
        .select("-password -email -ipAddress")
        .lean();

      if (!user) return fail("User not found.", 404);

      // Recent posts (paginated)
      const [posts, postTotal] = await Promise.all([
        Post.find({ author: user._id, isDeleted: false })
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .populate("thread", "title subforum")
          .select("content thread createdAt reactionCount")
          .lean(),
        Post.countDocuments({ author: user._id, isDeleted: false }),
      ]);

      // Is own profile?
      const isOwnProfile = viewer?._id === user._id.toString();

      // Mods can see extra info
      const canViewModInfo = viewer?.role?.permissions?.canViewIPs;

      return ok({
        profile: {
          ...user,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          email:     isOwnProfile ? (user as any).email : undefined,
          isOwnProfile,
        },
        posts: {
          items: posts,
          total: postTotal,
          page,
          pages: Math.ceil(postTotal / limit),
        },
        canModerate: canViewModInfo,
      });
    } catch (err) {
      return serverError(err, "GET /api/users/[username]");
    }
  });
}