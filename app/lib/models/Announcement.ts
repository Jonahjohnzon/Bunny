// app/lib/models/Announcement.ts
import mongoose, { Schema, model, models } from "mongoose";

export interface IAnnouncement extends mongoose.Document {
  message: string;
  type: "info" | "warning" | "success" | "danger";
  createdBy: mongoose.Types.ObjectId;
  startsAt: Date;
  expiresAt: Date | null; // null = never expires
  isActive: boolean;       // manual on/off switch, independent of expiresAt
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    message: { type: String, required: true, trim: true, maxlength: 500 },
    type: {
      type: String,
      enum: ["info", "warning", "success", "danger"],
      default: "info",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startsAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Fast lookup for "what's currently live" queries
AnnouncementSchema.index({ isActive: 1, startsAt: 1, expiresAt: 1 });

export default models.Announcement || model<IAnnouncement>("Announcement", AnnouncementSchema);