const mongoose = require("mongoose");
const { Schema } = mongoose;

const MenuItemSchema = new Schema(
  {
    menuId: { type: Schema.Types.ObjectId, ref: "Menu" },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    image: {
      data: Buffer, // Store the file as a binary buffer
      contentType: String, // Store the file's content type
      originalName: String, // Store the original file name
    },
    description: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

/* Pre update middleware used to update the __v field on each document update */
MenuItemSchema.pre("update", function (next) {
  this.update({}, { $inc: { __v: 1 } }, next);
});

module.exports = mongoose.model("MenuItem", MenuItemSchema);
