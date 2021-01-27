const mongoose = require("mongoose");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const mongooseIntlPhoneNumber = require("mongoose-intl-phone-number");
const validator = require("validator");
const bycrypt = require("bcrypt"),
  SALT_WORK_FACTOR = 10;
const { Schema } = mongoose;

const AccountSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      validate: [validator.isEmail, "invalid email"],
    },
    phoneNumber: { type: String, required: true, trim: true, unique: true },
    address_id: { type: Schema.Types.ObjectId, ref: "Address" },
    password: { type: String, required: true, trim: true, minlength: 8 },
    token: { type: String },
  },
  {
    timestamps: true,
  }
);

AccountSchema.plugin(mongooseIntlPhoneNumber, {
  hook: "validate",
  phoneNumberField: "phoneNumber",
  nationalFormatField: "nationalFormat",
  internationalFormat: "internationalFormat",
  countryCodeField: "countryCode",
});

AccountSchema.pre("save", function (next) {
  var user = this;

  if (!user.isModified("password")) return next();

  bycrypt.genSalt(SALT_WORK_FACTOR, (error, salt) => {
    if (error) next(error);
    bycrypt.hash(user.password, salt, (error, hash) => {
      if (error) next(error);
      user.password = hash;
      next();
    });
  });
});

AccountSchema.methods.comparePassword = function (candidatePassword, callBack) {
  bycrypt.compare(candidatePassword, this.password, (error, isMatch) => {
    if (error) return callBack(error);
    callBack(undefined, isMatch);
  });
};

AccountSchema.methods.generateToken = function (callBack) {
  var user = this;
  var token = jwt.sign(user._id, process.env.SECRET);
  user.token = token;
  user.save((error, user) => {
    if (error) return callBack(error);
    callBack(undefined, user);
  });
};

module.exports = mongoose.model("Account", AccountSchema);
