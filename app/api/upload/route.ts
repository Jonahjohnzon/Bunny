import { withAuth } from "@/app/lib/middleware/auth";
import { NextRequest } from "next/server";
import { ok, fail, serverError } from "@/app/lib/response";
import { uploadBuffer } from "@/lib/cloudinary/helpers";
import { compressEditorImage } from "@/lib/cloudinary/compress-editor";

export const runtime = "nodejs"; // sharp needs Node, not Edge

const MAX_BYTES = 1 * 1024 * 1024; // 1MB
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

export async function POST(req: NextRequest) {
  return withAuth(req, async (user) => {
    try {
      const form = await req.formData();
      const file = form.get("file");

      if (!(file instanceof File)) return fail("No file provided.");
      if (!ALLOWED_TYPES.has(file.type)) return fail("Unsupported file type. Use PNG, JPEG, WEBP, or GIF.");
      if (file.size > MAX_BYTES) return fail("File too large. Max 1MB.");

      const rawBuffer = Buffer.from(await file.arrayBuffer());

      let buffer: Buffer;
      let outMimeType = file.type;
      try {
        ({ buffer, mimeType: outMimeType } = await compressEditorImage(rawBuffer, file.type));
      } catch {
        return fail("Could not process image.");
      }

      const result = await uploadBuffer(buffer, { folder: "forum/editor" });

      return ok({ url: result.secure_url, publicId: result.public_id });
    } catch (err) {
      return serverError(err, "POST /api/upload");
    }
  });
}