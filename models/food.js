const mongoose = require("mongoose");
const { Schema } = mongoose;

const FoodSchema = new Schema(
  {
    sectionId: { type: Schema.Types.ObjectId, ref: "Section" },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    picture: {
      url: { type: String, required: true },
      s3_key: { type: String, required: true },
    },
    description: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

/* Pre update middleware used to update the __v field on each document update */
FoodSchema.pre("update", function (next) {
  this.update({}, { $inc: { __v: 1 } }, next);
});
// FoodSchema.path("url").validate((val) => {
//   let urlRegex =
//     /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
//   return urlRegex.test(val);
// }, "Invalid URL.");
module.exports = mongoose.model("Food", FoodSchema);
