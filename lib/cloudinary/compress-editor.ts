// lib/cloudinary/compress-editor.ts
import sharp from "sharp";

const MAX_DIMENSION = 500; // generous — editor images can be full-width content
const QUALITY = 75;

/**
 * General-purpose compression for arbitrary editor-inserted images.
 * No fixed aspect ratio — just caps the largest dimension and re-encodes.
 * Animated GIFs pass through untouched (sharp would flatten them to one frame).
 */
export async function compressEditorImage(
  buffer: Buffer,
  mimeType: string
): Promise<{ buffer: Buffer; mimeType: string }> {
  if (mimeType === "image/gif") {
    return { buffer, mimeType };
  }

  const compressed = await sharp(buffer)
    .rotate()
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: QUALITY })
    .toBuffer();

  return { buffer: compressed, mimeType: "image/jpeg" };
}