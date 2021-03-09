const mongoose = require("mongoose");
const { Schema } = mongoose;

const FaqSchema = new Schema({
    question: { type: String, required: true, trim: true },
    answers: [{ type: String, required: true, trim: true }]
},
{
  timestamps: true
});

module.exports = mongoose.model('Faq', FaqSchema);