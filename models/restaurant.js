const mongoose = require("mongoose");
const validator = require("validator");
const mongooseIntlPhoneNumber = require("mongoose-intl-phone-number");
const { Schema } = mongoose;

const RestaurantSchema = new Schema(
  {
    addressId: { type: Schema.Types.ObjectId, ref: "Address" },
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true, unique: true },
    restaurantInfo: { type: String, trim: true },
    image: {
      data: Buffer, // Store the file as a binary buffer
      contentType: String, // Store the file's content type
      originalName: String, // Store the original file name
    },
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

/* Pre update middleware used to update the __v field on each document update */
RestaurantSchema.pre("update", function (next) {
  this.update({}, { $inc: { __v: 1 } }, next);
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
