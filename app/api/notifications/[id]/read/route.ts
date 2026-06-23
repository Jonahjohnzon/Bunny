"use server";

import mongoosedb from "@/app/lib/db/db";
import Notification from "@/app/lib/models/Notification";
import { withAuth } from "../../../../lib/middleware/auth";
import { ok, fail, serverError } from "../../../../lib/response";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(req, async (user) => {
    try {
      await mongoosedb();
      const { id } = await params;

      // Scoped to `user: user._id` so no one can mark someone else's notification read
      const notification = await Notification.findOneAndUpdate(
        { _id: id, user: user._id },
        { read: true },
        { new: true }
      );

      if (!notification) return fail("Notification not found.", 404);
      return ok(notification);
    } catch (err) {
      return serverError(err, "PATCH /api/notifications/[id]/read");
    }
  });
}