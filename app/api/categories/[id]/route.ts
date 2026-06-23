"use server";

import mongoosedb from "@/app/lib/db/db";
import Category from "@/app/lib/models/CategorySchema";
import Subforum from "@/app/lib/models/SubforumSchema";
import { withPermission } from "../../../lib/middleware/auth";
import { ok, fail, serverError } from "../../../lib/response";

// GET /api/categories/:id — fetch one category
type SubforumTreeItem = {
  _id: { toString(): string } | string;
  parent?: string | null;
  order: number;
  children?: SubforumTreeItem[];
  [key: string]: unknown;
};

function buildSubforumTree(flat: SubforumTreeItem[], parentId: string | null = null): SubforumTreeItem[] {
  return flat
    .filter((s) => String(s.parent ?? null) === String(parentId))
    .sort((a, b) => a.order - b.order)
    .map((s) => ({
      ...s,
      children: buildSubforumTree(flat, s._id.toString()),
    }));
}

// GET /api/categories/:id — fetch one category with its subforums nested as a tree
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    await mongoosedb();
    const { id } = await params;
    

    const category = await Category.findById(id).lean();
    if (!category) return fail("Category not found.", 404);

  
    const flatSubforums = await Subforum.find({ category: id })
      .sort({ order: 1 })
      .lean();
     
    const subforums = buildSubforumTree(flatSubforums);

    return ok({ ...category, subforums });
  } catch (err) {
    return serverError(err, "GET /api/categories/:id");
  }
}

// PATCH /api/categories/:id — update name, description, icon, order (admin only)




// PATCH /api/categories/[id]
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPermission(req, "canManageCategories", async () => {
    try {
      await mongoosedb();
      const { id } = await params;
      const body = await req.json();
      const allowed = ["name", "description", "icon", "order", "accentColor"];
      const updates: Record<string, unknown> = {};
      for (const k of allowed) {
        if (body[k] !== undefined) updates[k] = body[k];
      }
      if (!Object.keys(updates).length) return fail("Nothing to update.");
      const updated = await Category.findByIdAndUpdate(id, updates, { new: true });
      if (!updated) return fail("Category not found.", 404);
      return ok(updated);
    } catch (err) {
      return serverError(err, "PATCH /api/categories/[id]");
    }
  });
}

// DELETE /api/categories/[id]
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPermission(req, "canManageCategories", async () => {
    try {
      await mongoosedb();
      const { id } = await params;
      const hasSubforums = await Subforum.exists({ category: id });
      if (hasSubforums) {
        return fail("Remove or move all subforums before deleting this category.", 400);
      }
      await Category.findByIdAndDelete(id);
      return ok({ deleted: true });
    } catch (err) {
      return serverError(err, "DELETE /api/categories/[id]");
    }
  });
}