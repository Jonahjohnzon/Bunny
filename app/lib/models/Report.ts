import mongoose, { Schema } from "mongoose";

// models/Report.ts
const Report = new Schema({
  reporter:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:         { type: String, enum: ['post', 'thread', 'user'] },
  targetPost:   { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  targetThread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread' },
  targetUser:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reason:       { type: String, required: true },
  status:       { type: String, enum: ['open','resolved','dismissed'], default: 'open' },
  resolvedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt:   { type: Date },
  notes:        { type: String },                         // mod notes
}, { timestamps: true });

export default mongoose.models.Report ||
  mongoose.model("Report", Report);