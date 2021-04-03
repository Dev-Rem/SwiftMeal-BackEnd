const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = Schema(
  {
    account_id: { type: Schema.Types.ObjectId, ref: "Account" },
    restaurant_id: { type: Schema.Types.ObjectId, ref: "Restaurant" },
    data: { type: Date, required: true },
    status: { type: String, required: true, trim: true },
    time: { type: Date, default: Date.now },
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
