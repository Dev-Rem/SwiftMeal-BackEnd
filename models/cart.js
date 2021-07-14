const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartSchema = new Schema(
  {
    accountId: { type: Schema.Types.ObjectId, ref: "Account" },
    items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
  },
  {
    timestamps: true,
  }
);

/* Pre update middleware used to update the __v field on each document update */
CartSchema.pre("update", function (next) {
  this.update({}, { $inc: { __v: 1 } }, next);
});
module.exports = mongoose.model("Cart", CartSchema);
