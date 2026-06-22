import mongoose, { Schema } from "mongoose";


// models/Reaction.ts  — tracks who reacted to what (prevents duplicates)
const Reaction = new Schema({
  post:         { type:  mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  user:         { type:  mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:         { type: String, enum: ['like','love','haha','wow','sad','angry'] },
}, { timestamps: true });

Reaction.index({ post: 1, user: 1 }, { unique: true }); // one reaction per user per post

export default mongoose.models.Reaction ||
  mongoose.model("Reaction", Reaction);