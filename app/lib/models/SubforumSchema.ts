import mongoose, { Schema } from "mongoose";


// models/Subforum.ts  — lives inside a Category e.g. "Announcements", "Help"
const Subforum = new Schema({
  name:           { type: String, required: true },
  description:    { type: String, default: '' },
  category:       { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  order:          { type: Number, default: 0 },
  icon:           { type: String, default: null },
  isPrivate:      { type: Boolean, default: false },
  isReadOnly:     { type: Boolean, default: false },      // only mods can post
  allowedRoles:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
  threadCount:    { type: Number, default: 0 },
  postCount:      { type: Number, default: 0 },
  leadsToThreads:{type: Boolean, default: true},
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subforum',
    default: null,
  },
  lastPost: {
    thread:       { type: mongoose.Schema.Types.ObjectId, ref: 'Thread' },
    user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt:    Date,
  },
}, { timestamps: true });

export default mongoose.models.Subforum ||
  mongoose.model("Subforum", Subforum);