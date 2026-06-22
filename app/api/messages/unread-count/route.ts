"use server";

import mongoosedb from "@/app/lib/db/db";
import DM from "@/app/lib/models/DirectMessage";
import { withAuth } from "../../../lib/middleware/auth";
import { ok, serverError } from "../../../lib/response";

export async function GET(req: Request) {
  return withAuth(req, async (user) => {
    try {
      await mongoosedb();
      const unreadConversations = await DM.countDocuments({
        participants: user._id,
        messages: { $elemMatch: { sender: { $ne: user._id }, readAt: null } },
      });
      return ok({ unreadConversations });
    } catch (err) {
      return serverError(err, "GET /api/messages/unread-count");
    }
  });
}