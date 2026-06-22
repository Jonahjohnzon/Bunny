import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['reply', 'quote', 'reaction', 'mention', 'warning', 'dm', 'system'],
    required: true,
  },
  read:    { type: Boolean, default: false },
  actor:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who triggered it (sender, admin, etc.)
  thread:  { type: mongoose.Schema.Types.ObjectId, ref: 'Thread' },
  post:    { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  message: { type: String }, // freeform text — admin warning body, or DM preview snippet
}, { timestamps: true });

NotificationSchema.index({ user: 1, read: 1, createdAt: -1 });

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);