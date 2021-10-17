const mongoose = require("mongoose");
const { Schema } = mongoose;

const PaymentSchema = new Schema(
  {
    account_id: { type: Schema.Types.ObjectId, ref: "Account" },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    total: { type: Number, required: true },
    method: { type: String, required: true, trim: true },
    status: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

/* Pre update middleware used to update the __v field on each document update */
PaymentSchema.pre("update", function (next) {
  this.update({}, { $inc: { __v: 1 } }, next);
});

module.exports = mongoose.model("Payment", PaymentSchema);
