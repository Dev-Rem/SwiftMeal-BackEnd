const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = Schema(
  {
    accountId: { type: Schema.Types.ObjectId, ref: "Account" },
    cartId: { type: Schema.Types.ObjectId, ref: "Cart" },
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant" },
    status: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

/* Pre update middleware used to update the __v field on each document update */
OrderSchema.pre("update", function (next) {
  this.update({}, { $inc: { __v: 1 } }, next);
});

module.exports = mongoose.model("Order", OrderSchema);
