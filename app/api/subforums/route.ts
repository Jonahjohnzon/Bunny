"use server";

import mongoosedb from "@/app/lib/db/db";
import Subforum from "@/app/lib/models/SubforumSchema";
import { withPermission } from "@/app/lib/middleware/auth";
import { created, fail, serverError } from "@/app/lib/response";
import { bumpVersion } from "@/app/lib/cache";

// POST /api/subforums — create (admin)
export async function POST(req: Request) {
  return withPermission(req, "canManageCategories", async () => {
    try {
      await mongoosedb();
      const body = await req.json();

      if (!body.name?.trim()) return fail("Name is required.");
      if (!body.categoryId) return fail("categoryId is required.");

      if (body.parentId) {
        const parent = await Subforum.findById(body.parentId);
        if (!parent) return fail("Parent subforum not found.", 404);
        if (parent.category.toString() !== body.categoryId)
          return fail("Parent must belong to the same category.");
      }

      const count = await Subforum.countDocuments({
        category: body.categoryId,
        parent: body.parentId ?? null,
      });

      const subforum = await Subforum.create({
        name: body.name.trim(),
        description: body.description?.trim() ?? "",
        category: body.categoryId,
        parent: body.parentId ?? null,
        leadsToThreads: body.leadsToThreads ?? true,
        order: body.order ?? count,
        icon: body.icon ?? null,
        isPrivate: body.isPrivate ?? false,
        isReadOnly: body.isReadOnly ?? false,
        allowedRoles: body.allowedRoles ?? [],
      });

      // The new subforum has nothing cached yet — but its parent's page
      // data (child list) just changed, so invalidate that.
      if (body.parentId) {
        await bumpVersion("subforum", body.parentId);
      }

      return created(subforum);
    } catch (err) {
      return serverError(err, "POST /api/subforums");
    }
  });
}