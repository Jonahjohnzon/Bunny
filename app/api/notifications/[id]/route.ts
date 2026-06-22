"use server";

import mongoosedb from "@/app/lib/db/db";
import Notification from "@/app/lib/models/Notification";
import { withAuth } from "../../../lib/middleware/auth";
import { ok, fail, serverError } from "../../../lib/response";

// PATCH /api/notifications/[id] — mark single notification as read
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  return withAuth(req, async (user) => {
    try {
      await mongoosedb();
      const notif = await Notification.findById(params.id);

      if (!notif) return fail("Notification not found.", 404);
      if (notif.user.toString() !== user._id) return fail("Not allowed.", 403);

      await Notification.findByIdAndUpdate(params.id, { read: true });
      return ok({ message: "Marked as read." });
    } catch (err) {
      return serverError(err, "PATCH /api/notifications/[id]");
    }
  });
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  return withAuth(req, async (user) => {
    try {
      await mongoosedb();
      const { id } = await params;
      const deleted = await Notification.findOneAndDelete({ _id: id, user: user._id });
      if (!deleted) return fail("Notification not found.", 404);

      return ok({ message: "Notification deleted." });
    } catch (err) {
      return serverError(err, "DELETE /api/notifications/[id]");
    }
  });
}