"use server";

import mongoosedb from "@/app/lib/db/db";
import User from "@/app/lib/models/User";
import Warning from "@/app/lib/models/WarningSchema";
import Notification from "@/app/lib/models/Notification";
import { withPermission } from "../../lib/middleware/auth";
import { ok, created, fail, serverError } from "../../lib/response";

// POST /api/admin/ban — ban a user
export async function POST_BAN(req: Request) {
  return withPermission(req, "canBanUser", async (mod) => {
    try {
      await mongoosedb();
      const body = await req.json();

      if (!body.userId) return fail("userId is required.");

      const target = await User.findById(body.userId);
      if (!target) return fail("User not found.", 404);

      // Cannot ban someone with equal/higher role priority
      if (target.role?.priority >= mod.role?.permissions?.priority) {
        return fail("You cannot ban this user.");
      }

      await User.findByIdAndUpdate(body.userId, {
        isBanned:     true,
        banReason:    body.reason ?? "No reason provided.",
        banExpiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      });

      return ok({ message: `${target.username} has been banned.` });
    } catch (err) {
      return serverError(err, "POST /api/admin/ban");
    }
  });
}

// POST /api/admin/unban — unban a user
export async function POST_UNBAN(req: Request) {
  return withPermission(req, "canBanUser", async () => {
    try {
      await mongoosedb();
      const body = await req.json();
      if (!body.userId) return fail("userId is required.");

      await User.findByIdAndUpdate(body.userId, {
        isBanned:     false,
        banReason:    null,
        banExpiresAt: null,
      });

      return ok({ message: "User unbanned." });
    } catch (err) {
      return serverError(err, "POST /api/admin/unban");
    }
  });
}

// POST /api/admin/warn — issue a warning
export async function POST_WARN(req: Request) {
  return withPermission(req, "canWarnUser", async (mod) => {
    try {
      await mongoosedb();
      const body = await req.json();

      if (!body.userId) return fail("userId is required.");
      if (!body.reason?.trim()) return fail("Warning reason is required.");

      const warning = await Warning.create({
        user:      body.userId,
        issuedBy:  mod._id,
        reason:    body.reason.trim(),
        points:    body.points ?? 1,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      });

      // Notify user of warning
      await Notification.create({
        user:  body.userId,
        type:  "warning",
        actor: mod._id,
      });

      return created(warning);
    } catch (err) {
      return serverError(err, "POST /api/admin/warn");
    }
  });
}


