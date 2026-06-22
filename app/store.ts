import { proxy } from "valtio";

interface RoleInfo {
  _id: string;
  name: string;
  color: string;
  permissions:null
}

export const store = proxy({
  // auth / hydration
  hydrated: false,
  _id: null as string | null,
  authChecked: false, // flips true once the initial /api/me check resolves — use this to avoid a logged-out flash on refresh

  // identity
  username: "",
  avatar: null as string | null,
  banner: null as string | null,
  bio: "",
  signature: "",
  customTitle: "",

  // role & permissions (populate role on the server, send just what the UI needs)
  role: null as RoleInfo | null,

  // stats
  postCount: 0,
  threadCount: 0,
  reputation: 0,

  // moderation
  isBanned: false,
  banReason: null as string | null,
  banExpiresAt: null as string | null, // ISO string; null = permanent or not banned

  // verification
  isVerified: false,

  // preferences
  theme: "dark-default",
  timezone: "UTC",

  // socials
  socials: {
    twitter: "",
    github: "",
    website: "",
  },

  // UI-only state (not from the server)
  bellopen: false,
});