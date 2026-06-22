import mongoose, { Schema } from "mongoose";

// models/Category.ts  — top level grouping e.g. "General", "Tech"
const Category = new Schema({
  name:         { type: String, required: true },
  description:  { type: String, default: '' },
  icon:         { type: String, default: null },
  order:        { type: Number, default: 0 },             // display order
  isPrivate:    { type: Boolean, default: false },
  allowedRoles: [{  type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],        // empty = everyone
  accentColor: {type: String, default: ''}
}, { timestamps: true });

export default mongoose.models.Category ||
  mongoose.model("Category", Category);