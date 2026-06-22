import mongoose, { Schema, type Document, type Model } from "mongoose";

// ── Types ─────────────────────────────────────────────────────────────────
export interface IPermissions {
  // Thread permissions
  canCreateThread: boolean;
  canReplyToThread: boolean;
  canEditOwnThread: boolean;
  canDeleteOwnThread: boolean;
  canPinThread: boolean;
  canLockThread: boolean;
  canMoveThread: boolean;

  // Post permissions
  canEditOwnPost: boolean;
  canDeleteOwnPost: boolean;
  canEditAnyPost: boolean;
  canDeleteAnyPost: boolean;

  // User permissions
  canUploadAvatar: boolean;
  canUseSignature: boolean;
  canSendDM: boolean;

  // Mod permissions
  canBanUser: boolean;
  canWarnUser: boolean;
  canViewReports: boolean;
  canManageReports: boolean;
  canViewIPs: boolean;

  // Admin permissions
  canManageRoles: boolean;
  canManageCategories: boolean;
  canManageThemes: boolean;
  canAccessAdmin: boolean;
}

export interface IRole extends Document {
  name: string;
  color: string;
  priority: number;
  isDefault: boolean;
  permissions: IPermissions;
  createdAt: Date;
  updatedAt: Date;
}

// ── Schema ────────────────────────────────────────────────────────────────
const RoleSchema = new Schema<IRole>({
  name:         { type: String, required: true, unique: true }, // "Admin", "Mod", "Member"
  color:        { type: String, default: '#8a8d91' },           // shown next to username
  priority:     { type: Number, default: 0 },                   // higher = more powerful
  isDefault:    { type: Boolean, default: false },               // assigned on register
  permissions: {
    // Thread permissions
    canCreateThread:      { type: Boolean, default: true },
    canReplyToThread:     { type: Boolean, default: true },
    canEditOwnThread:     { type: Boolean, default: true },
    canDeleteOwnThread:   { type: Boolean, default: false },
    canPinThread:         { type: Boolean, default: false },
    canLockThread:        { type: Boolean, default: false },
    canMoveThread:        { type: Boolean, default: false },

    // Post permissions
    canEditOwnPost:       { type: Boolean, default: true },
    canDeleteOwnPost:     { type: Boolean, default: false },
    canEditAnyPost:       { type: Boolean, default: false },
    canDeleteAnyPost:     { type: Boolean, default: false },

    // User permissions
    canUploadAvatar:      { type: Boolean, default: true },
    canUseSignature:      { type: Boolean, default: true },
    canSendDM:            { type: Boolean, default: true },

    // Mod permissions
    canBanUser:           { type: Boolean, default: false },
    canWarnUser:          { type: Boolean, default: false },
    canViewReports:       { type: Boolean, default: false },
    canManageReports:     { type: Boolean, default: false },
    canViewIPs:           { type: Boolean, default: false },

    // Admin permissions
    canManageRoles:       { type: Boolean, default: false },
    canManageCategories:  { type: Boolean, default: false },
    canManageThemes:      { type: Boolean, default: false },
    canAccessAdmin:       { type: Boolean, default: false },
  },
}, { timestamps: true });

// Prevents "Cannot overwrite model once compiled" errors during Next.js hot reload
const Role: Model<IRole> = mongoose.models.Role || mongoose.model<IRole>("Role", RoleSchema);

export default Role;