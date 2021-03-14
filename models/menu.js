const mongoose = require("mongoose");
const { Schema } = mongoose;

const MenuSchema = new Schema(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant" },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    sections: [{ type: Schema.Types.ObjectId, ref: "Section" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Menu", MenuSchema);
