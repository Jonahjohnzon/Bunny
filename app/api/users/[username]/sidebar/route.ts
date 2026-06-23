// app/api/users/[username]/sidebar/route.ts
import mongoosedb from "@/app/lib/db/db";
import User from "@/app/lib/models/User";
import { withOptionalAuth } from "@/app/lib/middleware/auth";
import { ok, fail, serverError } from "@/app/lib/response";
import { getProfileSidebarData } from "@/app/services/profileSidebarService";

// GET /api/users/[username]/sidebar
export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  return withOptionalAuth(req, async (viewer) => {
    try {
      await mongoosedb();
      const { username } = await params;

      const user = await User.findOne({ username }).select("_id").lean();
      if (!user) return fail("User not found.", 404);

      const isOwnProfile = viewer?._id.toString() === user._id.toString();
      const canModerate = viewer?.role?.permissions?.canModerateUsers ?? false;
         
      const data = await getProfileSidebarData(user._id.toString());
      return ok({
        ...data,
        isOwnProfile,
        canModerate,
      });
    } catch (err) {
      return serverError(err, "GET /api/users/[username]/sidebar");
    }
  });
}