"use server";

import mongoosedb from "@/app/lib/db/db";
import Report from "@/app/lib/models/Report";
import { withAuth, withPermission } from "../../lib/middleware/auth";
import { ok, created, fail, serverError, getPagination } from "../../lib/response";

// POST /api/reports — file a report
export async function POST(req: Request) {
  return withAuth(req, async (user) => {
    try {
      await mongoosedb();
      const body = await req.json();

      if (!body.reason?.trim()) return fail("Report reason is required.");
      if (!["post", "thread", "user"].includes(body.type)) return fail("Invalid report type.");

      // Check not already reported by same user
      const existing = await Report.findOne({
        reporter: user._id,
        [`target${body.type.charAt(0).toUpperCase() + body.type.slice(1)}`]: body.targetId,
        status: "open",
      });
      if (existing) return fail("You have already reported this.");

      const report = await Report.create({
        reporter: user._id,
        type:     body.type,
        [`target${body.type.charAt(0).toUpperCase() + body.type.slice(1)}`]: body.targetId,
        reason:   body.reason.trim(),
      });

      return created(report);
    } catch (err) {
      return serverError(err, "POST /api/reports");
    }
  });
}

// GET /api/reports — list reports (mods only)
export async function GET(req: Request) {
  return withPermission(req, "canViewReports", async () => {
    try {
      await mongoosedb();
      const { searchParams } = new URL(req.url);
      const { page, limit } = getPagination(searchParams, 25);
      const status = searchParams.get("status") ?? "open";

      const filter = status === "all" ? {} : { status };
      const [reports, total] = await Promise.all([
        Report.find(filter)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .populate("reporter",    "username avatar")
          .populate("resolvedBy",  "username")
          .populate("targetPost",  "content author")
          .populate("targetThread","title")
          .populate("targetUser",  "username")
          .lean(),
        Report.countDocuments(filter),
      ]);

      return ok({ reports, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
      return serverError(err, "GET /api/reports");
    }
  });
}

// PATCH /api/reports/[id] — resolve or dismiss (mods only)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  return withPermission(req, "canManageReports", async (user) => {
    try {
      await mongoosedb();
      const body = await req.json();

      if (!["resolved", "dismissed"].includes(body.status)) {
        return fail("Status must be 'resolved' or 'dismissed'.");
      }

      const report = await Report.findByIdAndUpdate(
        params.id,
        {
          status:     body.status,
          resolvedBy: user._id,
          resolvedAt: new Date(),
          notes:      body.notes ?? "",
        },
        { new: true }
      );

      if (!report) return fail("Report not found.", 404);
      return ok(report);
    } catch (err) {
      return serverError(err, "PATCH /api/reports/[id]");
    }
  });
}