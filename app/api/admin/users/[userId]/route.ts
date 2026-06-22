"use server";

import mongoosedb from "@/app/lib/db/db";
import User from "@/app/lib/models/User";
import Role from "@/app/lib/models/Role";
import { withPermission } from "../../../../lib/middleware/auth";
import { ok, fail, serverError } from "../../../../lib/response";


export async function PATCH(req: Request, { params }: { params: { userId: string } }) {
  return withPermission(req, "canAccessAdmin", async (requester: { _id: string }) => {
    try {
      await mongoosedb();

      const { userId } = await params;
      const body = await req.json();
      const { role: newRoleId } = body as { role?: string };

      if (!newRoleId) {
        return fail("role is required", 400);
      }


      const requesterUser = await User.findById(requester._id).populate("role", "priority");
      if (!requesterUser?.role) {
        return fail("Could not resolve your role", 403);
      }
      const myPriority: number = requesterUser.role.priority;

      const targetUser = await User.findById(userId).populate("role", "priority");
      if (!targetUser) {
        return fail("User not found", 404);
      }
      const targetCurrentPriority: number = targetUser.role?.priority ?? -1;

      const newRole = await Role.findById(newRoleId).select("priority");
      if (!newRole) {
        return fail("Role not found", 400);
      }
      const targetNewPriority: number = newRole.priority;

      if (targetCurrentPriority >= myPriority) {
        return fail("You cannot modify a user with this role", 403);
      }
      if (targetNewPriority >= myPriority) {
        return fail("You cannot assign a role at or above your own priority", 403);
      }

      const updated = await User.findByIdAndUpdate(
        userId,
        { role: newRoleId },
        { new: true }
      )
        .populate("role", "name color priority")
        .select("-password")
        .lean();

      return ok({ user: updated });
    } catch (err) {
      return serverError(err, "PATCH /api/admin/users/[userId]");
    }
  });
}