const mongoose = require("mongoose");
const { Schema } = mongoose;

const AddressSchema = new Schema(
  {
    accountId: { type: Schema.Types.ObjectId, ref: "Account" },
    streetNumber: { type: String, required: true, trim: true },
    streetName: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    postalCode: { type: Number, required: true, trim: true },
    country: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

/* Pre update middleware used to update the __v field on each document update */
AddressSchema.pre("update", function (next) {
  this.update({}, { $inc: { __v: 1 } }, next);
});

module.exports = mongoose.model("Address", AddressSchema);
