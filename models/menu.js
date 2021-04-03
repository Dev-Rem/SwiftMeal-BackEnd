const mongoose = require("mongoose");
const { Schema } = mongoose;

const MenuSchema = new Schema(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant" },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

/* Pre update middleware used to update the __v field on each document update */
MenuSchema.pre("update", function (next) {
  this.update({}, { $inc: { __v: 1 } }, next);
});

module.exports = mongoose.model("Menu", MenuSchema);
