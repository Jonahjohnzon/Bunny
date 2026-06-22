import mongoose, { Schema } from "mongoose";


// models/Warning.ts
const Warning = new Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issuedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason:       { type: String, required: true },
  points:       { type: Number, default: 1 },            // warning points system
  expiresAt:    { type: Date, default: null },
  isAcknowledged: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Warning ||
  mongoose.model("Warning", Warning);