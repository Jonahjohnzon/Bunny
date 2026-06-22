import mongoose, { Schema } from "mongoose";


// models/DirectMessage.ts
const DM = new Schema({
  participants: [{ type:  mongoose.Schema.Types.ObjectId, ref: 'User' }],       // always 2 users
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'DM' },
  messages: [{
    sender:     { type:  mongoose.Schema.Types.ObjectId, ref: 'User' },
    content:    String,
    readAt:     { type: Date, default: null },
    createdAt:  { type: Date, default: Date.now },
  }],
  lastMessageAt: { type: Date, default: Date.now },
}, { timestamps: true });

DM.index({ participants: 1 });

export default mongoose.models.DM ||
  mongoose.model("DM", DM);