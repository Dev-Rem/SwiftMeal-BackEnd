const mongoose = require("mongoose");
const { Schema } = mongoose;

const SectionSchema = new Schema(
  {
    menuId: { type: Schema.Types.ObjectId, ref: "Menu" },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Section", SectionSchema);
