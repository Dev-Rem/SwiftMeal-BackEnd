const mongoose = require("mongoose");
const { Schema } = mongoose;

const ItemSchema = new Schema(
  {
    food: { type: Schema.Types.ObjectId, ref: "Food" },
    discount: { type: Number, required: false },
    quantity: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

/* Pre update middleware used to update the __v field on each document update */
ItemSchema.pre("update", function (next) {
  this.update({}, { $inc: { __v: 1 } }, next);
});

module.exports = mongoose.model("Item", ItemSchema);
