const mongoose = require("mongoose");
const { Schema } = mongoose;

const FoodSchema = new Schema(
  {
    sectionId: { type: Schema.Types.ObjectId, ref: "Section" },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    picture: { data: Buffer, contentType: String },
    description: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

/* Pre update middleware used to update the __v field on each document update */
FoodSchema.pre("update", function (next) {
  this.update({}, { $inc: { __v: 1 } }, next);
});

module.exports = mongoose.model("Food", FoodSchema);
