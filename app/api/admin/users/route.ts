"use server";

import mongoosedb from "@/app/lib/db/db";
import User from "@/app/lib/models/User";
import { withPermission } from "../../../lib/middleware/auth";
import { ok,  serverError } from "../../../lib/response";


export async function GET(req: Request) {
  return withPermission(req, "canAccessAdmin", async () => {
    try {
      await mongoosedb();
      const { searchParams } = new URL(req.url);
      const search = searchParams.get("search") ?? "";
      const page   = parseInt(searchParams.get("page") ?? "1");
      const limit  = 30;

      const filter = search
        ? { username: { $regex: search, $options: "i" } }
        : {};

      const [users, total] = await Promise.all([
        User.find(filter)
          .populate("role", "name color")
          .select("-password")
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        User.countDocuments(filter),
      ]);

      return ok({ users, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
      return serverError(err, "GET /api/admin/users");
    }
  });
}


