"use server";

import mongoosedb from "@/app/lib/db/db";
import Notification from "@/app/lib/models/Notification";
import { withAuth } from "../../../lib/middleware/auth";
import { ok, serverError } from "../../../lib/response";

export async function PATCH(req: Request) {
  return withAuth(req, async (user) => {
    try {
      await mongoosedb();
      await Notification.updateMany({ user: user._id, read: false }, { read: true });
      return ok({ message: "All notifications marked as read." });
    } catch (err) {
      return serverError(err, "PATCH /api/notifications/read-all");
    }
  });
}