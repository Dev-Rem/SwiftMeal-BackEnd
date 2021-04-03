const mongoose = require("mongoose");
const { Schema } = mongoose;

const FaqSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    answers: [{ type: String, required: true, trim: true }],
  },
  {
    timestamps: true,
  }
);

/* Pre update middleware used to update the __v field on each document update */
FaqSchema.pre("update", function (next) {
  this.update({}, { $inc: { __v: 1 } }, next);
});

module.exports = mongoose.model("Faq", FaqSchema);
