const mongoose = require("mongoose");
const { Schema } = mongoose;

const SectionSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    menuId: { type: Schema.Types.ObjectId, ref: "Menu" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Section", SectionSchema);
