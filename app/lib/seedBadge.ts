// lib/seedBadges.ts
import BadgeModel from "@/app/lib/models/Badge";

const DEFAULT_BADGES = [
  { key: 'founder',       label: 'Founder',        icon: 'Crown',  color: '#f59e0b', tier: 'special' },
  { key: 'early_adopter', label: 'Early Adopter',  icon: 'Rocket', color: '#22c55e', tier: 'bronze' },
  { key: 'top_poster',    label: 'Top Poster',     icon: 'Flame',  color: '#ef4444', tier: 'gold' },
  // add up to however many badge *types* you want in the catalog —
  // this number is unrelated to the 10-per-user cap above
];

export async function seedBadges() {
  for (const badge of DEFAULT_BADGES) {
    await BadgeModel.updateOne({ key: badge.key }, { $setOnInsert: badge }, { upsert: true });
  }
}