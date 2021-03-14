const mongoose = require("mongoose");
const { Schema } = mongoose;

const SectionSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    foods: [{ type: Schema.Types.ObjectId, ref: "Food" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Section", SectionSchema);
