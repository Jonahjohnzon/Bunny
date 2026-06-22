// services/profileSidebarService.ts
import { getUserBadges } from "./badgeService";
import { getUserActivityStats } from "./activityService";

export async function getProfileSidebarData(id: string) {
    
  const [badges, activity] = await Promise.all([
    getUserBadges(id),
    getUserActivityStats(id),
  ]);

  return { badges, activity };
}