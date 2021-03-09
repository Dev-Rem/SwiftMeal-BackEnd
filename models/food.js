const mongoose = require("mongoose");
const { Schema } = mongoose;

const FoodSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: Number,
    picture: { data: Buffer, contentType: String, required: true },
    description: { type: String, required: true, trim: true },
    section_id: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Food", FoodSchema);
