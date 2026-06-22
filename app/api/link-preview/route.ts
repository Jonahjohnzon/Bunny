
import { ok, fail, serverError} from "../../lib/response";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  if (!url) return fail("Missing url.", 400);

  let target: URL;
  try {
    target = new URL(url);
    if (target.protocol !== "http:" && target.protocol !== "https:") throw new Error();
  } catch {
    return fail("Invalid url.", 400);
  }

  try {
    const res = await fetch(target.toString(), {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LinkPreviewBot/1.0)" },
      signal: AbortSignal.timeout(8000),
    });
    const html = await res.text();

    const meta = (prop: string) =>
      html.match(new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']+)["']`, "i"))?.[1]
      ?? html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:${prop}["']`, "i"))?.[1];

    const twitter = (name: string) =>
      html.match(new RegExp(`<meta[^>]+name=["']twitter:${name}["'][^>]+content=["']([^"']+)["']`, "i"))?.[1];

    const titleTag = html.match(/<title>([^<]*)<\/title>/i)?.[1];

    const title = meta("title") ?? twitter("title") ?? titleTag ?? target.hostname;
    const description = meta("description") ?? twitter("description") ?? "";
    let image = meta("image") ?? twitter("image") ?? "";
    if (image && !image.startsWith("http")) image = new URL(image, target).toString();
    const siteName = meta("site_name") ?? target.hostname;

    return ok({ url: target.toString(), title, description, image, siteName });
  } catch (err) {
    return serverError(err, "GET /api/link-preview");
  }
}