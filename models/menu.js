const mongoose = require("mongoose");
const { Schema } = mongoose;

const MenuSchema = new Schema(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant" },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Menu", MenuSchema);
