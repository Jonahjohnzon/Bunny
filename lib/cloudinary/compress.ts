// lib/cloudinary/compress.ts
import sharp from "sharp";

interface CompressPreset {
  maxWidth: number;
  maxHeight: number;
  quality: number; // 0–100
}

const PRESETS: Record<"avatar" | "banner", CompressPreset> = {
  avatar: { maxWidth: 400, maxHeight: 400, quality: 80 },
  banner: { maxWidth: 1600, maxHeight: 500, quality: 75 },
};

/**
 * Resizes + re-encodes an image buffer for a given field type.
 * Animated GIFs are passed through untouched (sharp would flatten to a single frame).
 */
export async function compressImage(
  buffer: Buffer,
  mimeType: string,
  field: "avatar" | "banner"
): Promise<{ buffer: Buffer; mimeType: string }> {
  if (mimeType === "image/gif") {
    return { buffer, mimeType };
  }

  const { maxWidth, maxHeight, quality } = PRESETS[field];

  const compressed = await sharp(buffer)
    .rotate() // respect EXIF orientation before stripping metadata
    .resize({
      width: maxWidth,
      height: maxHeight,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality })
    .toBuffer();

  return { buffer: compressed, mimeType: "image/jpeg" };
}