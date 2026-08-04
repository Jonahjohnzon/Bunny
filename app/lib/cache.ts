import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Default time-to-live for cached entries, in seconds.
// Acts as a safety net in case a mutation forgets to bump a version.
const DEFAULT_TTL_SECONDS = 60 * 10; // 24 hours

// ---------------------------------------------------------------------------
// Versioning
//
// Instead of tracking and deleting individual cache keys on invalidation,
// each entity (e.g. a subforum) has a version number stored in Redis.
// Cache keys embed that version. To invalidate, we just increment the
// version — all previously cached keys become orphaned and expire via TTL,
// no enumeration or deletion required.
// ---------------------------------------------------------------------------

export async function getVersion(entity: string, id: string): Promise<number> {
  const v = await redis.get<number>(`v:${entity}:${id}`);
  return v ?? 1;
}

export async function bumpVersion(entity: string, id: string): Promise<void> {
  // INCR auto-creates the key at 1 -> 2 if it doesn't exist yet.
  // Atomic, so concurrent invalidations can't race each other.
  await redis.incr(`v:${entity}:${id}`);
}

export async function bumpVersions(entity: string, ids: string[]): Promise<void> {
  if (!ids.length) return;
  await Promise.all(ids.map((id) => bumpVersion(entity, id)));
}

// ---------------------------------------------------------------------------
// Generic read-through cache
// ---------------------------------------------------------------------------

export async function cached<T>(
  keyParts: (string | number)[],
  fetcher: () => Promise<T>,
  ttl = DEFAULT_TTL_SECONDS
): Promise<T> {
  const key = keyParts.join(":");

  const hit = await redis.get<T>(key);
  if (hit !== null && hit !== undefined) return hit;

  const fresh = await fetcher();
  if (fresh !== null && fresh !== undefined) {
    await redis.set(key, fresh, { ex: ttl });
  }
  return fresh;
}

// ---------------------------------------------------------------------------
// Subforum-specific key builders
// ---------------------------------------------------------------------------

export async function subforumCacheKey(
  id: string,
  page: number,
  limit: number
): Promise<(string | number)[]> {
  const v = await getVersion("subforum", id);
  return ["subforum", id, "v", v, "page", page, "limit", limit];
}

// ---------------------------------------------------------------------------
// Category-specific key builders
//
// Both the full category list and a single category embed subforum data
// (nested tree, lastPost, postCount), so subforum mutations must also bump
// these versions — see invalidateCategoryCaches() below.
// ---------------------------------------------------------------------------

const CATEGORY_LIST_ID = "all";

export async function categoryListCacheKey(): Promise<(string | number)[]> {
  const v = await getVersion("categoryList", CATEGORY_LIST_ID);
  return ["categories", "list", "v", v];
}

export async function categoryCacheKey(id: string): Promise<(string | number)[]> {
  const v = await getVersion("category", id);
  return ["category", id, "v", v];
}

export async function bumpCategoryListVersion(): Promise<void> {
  await bumpVersion("categoryList", CATEGORY_LIST_ID);
}

// Call this whenever a subforum is created/updated/deleted, since both the
// full category list and the single-category endpoint embed subforum trees.
export async function invalidateCategoryCaches(categoryId?: string | null): Promise<void> {
  await bumpCategoryListVersion();
  if (categoryId) {
    await bumpVersion("category", categoryId);
  }
}

// ---------------------------------------------------------------------------
// Thread-specific key builders
//
// A single "thread" version covers both the thread-detail+posts endpoint
// and the paginated posts endpoint, since a new/edited/deleted post affects
// both. Bump it from: thread PATCH/DELETE, poll votes, and — importantly —
// wherever posts are created/edited/deleted (not in this file set).
// ---------------------------------------------------------------------------

export async function threadCacheKey(
  id: string,
  page: number,
  limit: number
): Promise<(string | number)[]> {
  const v = await getVersion("thread", id);
  return ["thread", id, "v", v, "page", page, "limit", limit];
}

export async function threadPostsCacheKey(
  id: string,
  page: number
): Promise<(string | number)[]> {
  const v = await getVersion("thread", id);
  return ["threadPosts", id, "v", v, "page", page];
}

export async function bumpThreadVersion(id: string): Promise<void> {
  await bumpVersion("thread", id);
}

// ---------------------------------------------------------------------------
// Announcement list key builder
// ---------------------------------------------------------------------------

const ANNOUNCEMENT_LIST_ID = "all";

export async function announcementListCacheKey(): Promise<(string | number)[]> {
  const v = await getVersion("announcementList", ANNOUNCEMENT_LIST_ID);
  return ["announcements", "list", "v", v];
}

export async function bumpAnnouncementListVersion(): Promise<void> {
  await bumpVersion("announcementList", ANNOUNCEMENT_LIST_ID);
}

// ---------------------------------------------------------------------------
// Forum stats — TTL-only cache, no version needed
//
// This is a floating time-window snapshot (online in last 30min, trending in
// last 48h), not tied to any single entity's state, so there's nothing
// sensible to "invalidate" — a short TTL alone keeps it reasonably fresh
// while sparing the DB from the aggregation on every homepage load.
// ---------------------------------------------------------------------------

const FORUM_STATS_TTL_SECONDS = 30;

export async function cachedForumStats<T>(fetcher: () => Promise<T>): Promise<T> {
  return cached(["forum", "stats"], fetcher, FORUM_STATS_TTL_SECONDS);
}