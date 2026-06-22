import mongoose, { Schema } from "mongoose";

// models/Post.ts
export const MAX_REPLY_DEPTH = 8; // cap nesting so threads don't run away sideways

const Post = new Schema({
  thread:        { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true },
  author:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content:       { type: String, required: true },        // HTML from rich text editor
  isFirstPost:   { type: Boolean, default: false },       // the opening post of a thread
  isDeleted:     { type: Boolean, default: false },
  deletedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  editedAt:      { type: Date, default: null },
  editedBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  editReason:    { type: String, default: null },
  ipAddress:     { type: String, default: null },         // for mod tools
  quotedPost:    { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // inline "quote" (BBCode-style)

  // ── Reddit-style nested replies ───────────────────────────────────────
  parentPost:    { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null }, // immediate parent — null = top-level
  rootPost:      { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null }, // top-level ancestor — null if this post IS top-level
  depth:         { type: Number, default: 0 },            // nesting level, capped at MAX_REPLY_DEPTH
  replyCount:    { type: Number, default: 0 },            // direct children of *this* post, not the whole thread

  attachments:   [{ type: String }],                      // file urls
  reactionCount: {
    like:  { type: Number, default: 0 },
    love:  { type: Number, default: 0 },
    haha:  { type: Number, default: 0 },
    wow:   { type: Number, default: 0 },
    sad:   { type: Number, default: 0 },
    angry: { type: Number, default: 0 },
  }
}, { timestamps: true });

Post.index({ thread: 1, createdAt: 1 });
Post.index({ thread: 1, parentPost: 1 }); // direct children of a post
Post.index({ thread: 1, rootPost: 1 });   // every reply under a top-level post (drives pagination fetch)
Post.index({ author: 1 });
Post.index({ content: 'text' }, { name: 'post_text' });

export default mongoose.models.Post ||
  mongoose.model("Post", Post);