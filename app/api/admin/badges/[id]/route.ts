// app/api/admin/badges/[id]/route.ts
import mongoosedb from "@/app/lib/db/db";
import { withPermission } from "@/app/lib/middleware/auth";
import { ok, serverError } from "@/app/lib/response";
import { updateBadge, deleteBadge } from "@/app/services/badgeService";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  return withPermission(req, "canAccessAdmin", async () => {
    try {
      await mongoosedb();
      const { id } = await params;
      const badge = await updateBadge(id, await req.json());
      return ok({ badge });
    } catch (err) {
      return serverError(err, "PATCH /api/admin/badges/[id]");
    }
  });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  return withPermission(req, "canAccessAdmin", async () => {
    try {
      await mongoosedb();
      const { id } = await params;
      await deleteBadge(id);
      return ok({ deleted: true });
    } catch (err) {
      return serverError(err, "DELETE /api/admin/badges/[id]");
    }
  });
}