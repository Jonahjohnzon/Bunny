// app/api/announcements/[id]/route.ts
"use server";

import mongoosedb from "@/app/lib/db/db";
import Announcement from "@/app/lib/models/Announcement";
import { withPermission } from "@/app/lib/middleware/auth";
import { ok, fail, serverError } from "@/app/lib/response";

// PATCH /api/announcements/[id]
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPermission(req, "canAccessAdmin", async (user) => {
    try {
      await mongoosedb();
      const { id } = await params;

      if (!user.role?.permissions?.canManageRoles) {
        return fail("You cannot edit announcements.", 403);
      }

      const existing = await Announcement.findById(id);
      if (!existing) return fail("Announcement not found.", 404);

      const body = await req.json();
      const update: Record<string, unknown> = {};

      if (body.message !== undefined) {
        if (!body.message.trim()) return fail("Message cannot be empty.");
        update.message = body.message.trim();
      }

      if (body.type !== undefined) {
        const validTypes = ["info", "warning", "success", "danger"];
        if (!validTypes.includes(body.type)) return fail("Invalid type.");
        update.type = body.type;
      }

      if (body.isActive !== undefined) update.isActive = !!body.isActive;
      if (body.startsAt !== undefined) update.startsAt = new Date(body.startsAt);

      if (body.durationHours) {
        const hours = Number(body.durationHours);
        if (!Number.isFinite(hours) || hours <= 0) {
          return fail("durationHours must be a positive number.");
        }
        update.expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
      } else if (body.expiresAt !== undefined) {
        update.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
      }

      const updated = await Announcement.findByIdAndUpdate(id, update, { new: true })
        .populate("createdBy", "username");

      return ok(updated);
    } catch (err) {
      return serverError(err, "PATCH /api/announcements/[id]");
    }
  });
}

// DELETE /api/announcements/[id]
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPermission(req, "canAccessAdmin", async (user) => {
    try {
      await mongoosedb();
      const { id } = await params;

      if (!user.role?.permissions?.canManageRoles) {
        return fail("You cannot delete announcements.", 403);
      }

      const existing = await Announcement.findById(id);
      if (!existing) return fail("Announcement not found.", 404);

      await Announcement.findByIdAndDelete(id);
      return ok({ deleted: true });
    } catch (err) {
      return serverError(err, "DELETE /api/announcements/[id]");
    }
  });
}