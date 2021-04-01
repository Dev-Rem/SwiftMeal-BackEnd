const mongoose = require("mongoose");
const { Schema } = mongoose;

const FoodSchema = new Schema(
  {
    sectionId: { type: Schema.Types.ObjectId, ref: "Section" },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    picture: { data: Buffer, contentType: String, required: true },
    description: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Food", FoodSchema);
