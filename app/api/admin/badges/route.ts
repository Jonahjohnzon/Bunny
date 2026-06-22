"use server"

// app/api/admin/badges/route.ts
import mongoosedb from "@/app/lib/db/db";
import { withPermission } from "@/app/lib/middleware/auth";
import { ok, fail, serverError } from "@/app/lib/response";
import { listAllBadges, createBadge } from "@/app/services/badgeService";

export async function GET(req: Request) {
  return withPermission(req, "canAccessAdmin", async () => {
    try {
      await mongoosedb();
      const badges = await listAllBadges();
      return ok({ badges });
    } catch (err) {
      return serverError(err, "GET /api/admin/badges");
    }
  });
}

export async function POST(req: Request) {
  return withPermission(req, "canAccessAdmin", async () => {
    try {
      await mongoosedb();
      const body = await req.json();

      if (!body.key || !body.label || !body.icon || !body.color) {
        return fail("key, label, icon, and color are required.", 422);
      }

      const badge = await createBadge(body);
      return ok({ badge });
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "code" in err && (err as { code?: number }).code === 11000) {
        return fail("A badge with that key already exists.", 409);
      }
      return serverError(err, "POST /api/admin/badges");
    }
  });
}