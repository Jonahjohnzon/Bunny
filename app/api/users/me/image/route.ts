import { NextRequest } from "next/server";
import mongoosedb from "@/app/lib/db/db";
import User from "@/app/lib/models/User";
import { ok, fail, serverError } from "@/app/lib/response";
import { uploadBuffer, deleteIfOwned } from "@/lib/cloudinary/helpers";
import { compressImage } from "@/lib/cloudinary/compress";
import { withAuth } from "@/app/lib/middleware/auth";

export const runtime = "nodejs"; // sharp needs Node, not Edge

const MAX_BYTES = 1 * 1024 * 1024; // 1MB
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const ALLOWED_FIELDS = new Set(["avatar", "banner"]);

export async function POST(req: NextRequest) {
  return withAuth(req, async (user) => {
    try {
      const form = await req.formData();
      const file = form.get("file");
      const field = form.get("field");

      if (!(file instanceof File)) return fail("No file provided.");
      if (typeof field !== "string" || !ALLOWED_FIELDS.has(field)) {
        return fail("field must be 'avatar' or 'banner'.");
      }
      if (!ALLOWED_TYPES.has(file.type)) return fail("Unsupported file type. Use PNG, JPEG, WEBP, or GIF.");
      if (file.size > MAX_BYTES) return fail("File too large. Max 1MB.");

      await mongoosedb();

      const dbUser = await User.findById(user._id).select(`${field}`);
      if (!dbUser) return fail("User not found.", 404);

      const oldUrl: string | null = dbUser[field] ?? null;

      await deleteIfOwned(oldUrl);

      const rawBuffer = Buffer.from(await file.arrayBuffer());

      let buffer: Buffer;
      try {
        ({ buffer } = await compressImage(rawBuffer, file.type, field as "avatar" | "banner"));
      } catch {
        return fail("Could not process image.");
      }

      const folder = field === "avatar" ? "forum/avatars" : "forum/banners";

      const result = await uploadBuffer(buffer, { folder, publicId: String(user._id) });

      dbUser[field] = result.secure_url;
      await dbUser.save();

      return ok({ url: result.secure_url });
    } catch (err) {
      return serverError(err, "POST /api/users/me/image");
    }
  });
}