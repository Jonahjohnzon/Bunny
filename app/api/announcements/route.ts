// app/api/announcements/route.ts
"use server";

import mongoosedb from "@/app/lib/db/db";
import Announcement from "@/app/lib/models/Announcement";
import { withPermission } from "@/app/lib/middleware/auth";
import { ok, created, fail, serverError } from "@/app/lib/response";

// GET /api/announcements — public, returns only currently-live announcements
export async function GET() {
  try {
    await mongoosedb();
    const now = new Date();

    const announcements = await Announcement.find({
      isActive: true,
      startsAt: { $lte: now },
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
    })
      .sort({ createdAt: -1 })
      .populate("createdBy", "username")
      .lean();

    return ok({ announcements });
  } catch (err) {
    return serverError(err, "GET /api/announcements");
  }
}

// POST /api/announcements — create (mod/admin only)
export async function POST(req: Request) {
  return withPermission(req, "canAccessAdmin", async (user) => {
    try {
      await mongoosedb();

      if (!user.role?.permissions?.canManageRoles) {
        return fail("You cannot create announcements.", 403);
      }

      const body = await req.json();
      if (!body.message?.trim()) return fail("Message is required.");

      const validTypes = ["info", "warning", "success", "danger"];
      const type = validTypes.includes(body.type) ? body.type : "info";

      let expiresAt: Date | null = null;
      if (body.durationHours) {
        const hours = Number(body.durationHours);
        if (!Number.isFinite(hours) || hours <= 0) {
          return fail("durationHours must be a positive number.");
        }
        expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
      } else if (body.expiresAt) {
        expiresAt = new Date(body.expiresAt);
      }

      const announcement = await Announcement.create({
        message: body.message.trim(),
        type,
        createdBy: user._id,
        startsAt: body.startsAt ? new Date(body.startsAt) : new Date(),
        expiresAt,
        isActive: body.isActive ?? true,
      });

      return created(announcement);
    } catch (err) {
      return serverError(err, "POST /api/announcements");
    }
  });
}