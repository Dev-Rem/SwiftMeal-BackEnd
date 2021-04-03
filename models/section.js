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

/* Pre update middleware used to update the __v field on each document update */
SectionSchema.pre("update", function (next) {
  this.update({}, { $inc: { __v: 1 } }, next);
});

module.exports = mongoose.model("Section", SectionSchema);
