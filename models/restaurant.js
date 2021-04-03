const mongoose = require("mongoose");
const validator = require("validator");
const mongooseIntlPhoneNumber = require("mongoose-intl-phone-number");
const { Schema } = mongoose;

const RestaurantSchema = new Schema(
  {
    addressId: { type: Schema.Types.ObjectId, ref: "Address" },
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true, unique: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      validate: [validator.isEmail, "invalid email"],
    },
  },
  {
    timestamps: true,
  }
);

/* Plugin for the phoneNumber field */
RestaurantSchema.plugin(mongooseIntlPhoneNumber, {
  hook: "validate",
  phoneNumberField: "phoneNumber",
  nationalFormatField: "nationalFormat",
  internationalFormat: "internationalFormat",
  countryCodeField: "countryCode",
});

/* Pre update middleware used to update the __v field on each document update */
RestaurantSchema.pre("update", function (next) {
  this.update({}, { $inc: { __v: 1 } }, next);
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
